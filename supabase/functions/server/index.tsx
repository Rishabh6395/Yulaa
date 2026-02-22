import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase clients
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-3da92bbe/health", (c) => {
  return c.json({ status: "ok" });
});

// ============ AUTH ENDPOINTS ============

// Signup endpoint for new students
app.post("/make-server-3da92bbe/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, role = 'student', phone, studentId } = body;

    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    // Create user in Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role, phone, studentId },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Error creating user during signup: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Store additional user data in KV store
    const userId = data.user.id;
    await kv.set(`user:${userId}`, {
      id: userId,
      email,
      name,
      role,
      phone,
      studentId,
      createdAt: new Date().toISOString()
    });

    return c.json({ 
      success: true, 
      user: { id: userId, email, name, role } 
    });
  } catch (err) {
    console.log(`Unexpected error in signup: ${err}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ============ ADMISSION ENDPOINTS ============

// Submit admission application
app.post("/make-server-3da92bbe/admissions", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization required" }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const admissionId = `admission:${Date.now()}:${user.id}`;
    
    const admissionData = {
      id: admissionId,
      userId: user.id,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      ...body
    };

    await kv.set(admissionId, admissionData);
    
    // Add to pending list
    const pending = await kv.get('admissions:pending') || [];
    pending.push(admissionId);
    await kv.set('admissions:pending', pending);

    return c.json({ success: true, admissionId, data: admissionData });
  } catch (err) {
    console.log(`Error submitting admission: ${err}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get admission applications (admin)
app.get("/make-server-3da92bbe/admissions", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization required" }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    const status = c.req.query('status') || 'all';

    let admissions = [];
    if (status === 'pending') {
      const pendingIds = await kv.get('admissions:pending') || [];
      admissions = await kv.mget(pendingIds);
    } else {
      const allAdmissions = await kv.getByPrefix('admission:');
      admissions = allAdmissions;
    }

    return c.json({ success: true, admissions });
  } catch (err) {
    console.log(`Error fetching admissions: ${err}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Update admission status (admin only)
app.put("/make-server-3da92bbe/admissions/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization required" }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    if (userProfile?.role !== 'admin' && userProfile?.role !== 'teacher') {
      return c.json({ error: "Admin access required" }, 403);
    }

    const admissionId = c.req.param('id');
    const body = await c.req.json();
    const { status, notes } = body;

    const admission = await kv.get(admissionId);
    if (!admission) {
      return c.json({ error: "Admission not found" }, 404);
    }

    admission.status = status;
    admission.notes = notes;
    admission.reviewedAt = new Date().toISOString();
    admission.reviewedBy = user.id;

    await kv.set(admissionId, admission);

    // Remove from pending if approved/rejected
    if (status !== 'pending') {
      const pending = await kv.get('admissions:pending') || [];
      const updated = pending.filter((id: string) => id !== admissionId);
      await kv.set('admissions:pending', updated);
    }

    return c.json({ success: true, admission });
  } catch (err) {
    console.log(`Error updating admission: ${err}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ============ ANNOUNCEMENT ENDPOINTS ============

app.post("/make-server-3da92bbe/announcements", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization required" }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    if (userProfile?.role !== 'admin' && userProfile?.role !== 'teacher') {
      return c.json({ error: "Admin/Teacher access required" }, 403);
    }

    const body = await c.req.json();
    const announcementId = `announcement:${Date.now()}`;
    
    const announcement = {
      id: announcementId,
      ...body,
      createdBy: user.id,
      createdAt: new Date().toISOString()
    };

    await kv.set(announcementId, announcement);

    return c.json({ success: true, announcement });
  } catch (err) {
    console.log(`Error creating announcement: ${err}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.get("/make-server-3da92bbe/announcements", async (c) => {
  try {
    const announcements = await kv.getByPrefix('announcement:');
    const sorted = announcements.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return c.json({ success: true, announcements: sorted });
  } catch (err) {
    console.log(`Error fetching announcements: ${err}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ============ ATTENDANCE ENDPOINTS ============

app.post("/make-server-3da92bbe/attendance", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization required" }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { studentId, date, status, method } = body;
    
    const attendanceId = `attendance:${studentId}:${date}`;
    const attendance = {
      id: attendanceId,
      studentId,
      date,
      status,
      method,
      markedBy: user.id,
      markedAt: new Date().toISOString()
    };

    await kv.set(attendanceId, attendance);

    return c.json({ success: true, attendance });
  } catch (err) {
    console.log(`Error marking attendance: ${err}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.get("/make-server-3da92bbe/attendance/:studentId", async (c) => {
  try {
    const studentId = c.req.param('studentId');
    const records = await kv.getByPrefix(`attendance:${studentId}:`);
    return c.json({ success: true, records });
  } catch (err) {
    console.log(`Error fetching attendance: ${err}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ============ HOMEWORK ENDPOINTS ============

app.post("/make-server-3da92bbe/homework", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization required" }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const homeworkId = `homework:${Date.now()}`;
    
    const homework = {
      id: homeworkId,
      ...body,
      createdBy: user.id,
      createdAt: new Date().toISOString()
    };

    await kv.set(homeworkId, homework);

    return c.json({ success: true, homework });
  } catch (err) {
    console.log(`Error creating homework: ${err}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.get("/make-server-3da92bbe/homework", async (c) => {
  try {
    const homework = await kv.getByPrefix('homework:');
    const sorted = homework.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return c.json({ success: true, homework: sorted });
  } catch (err) {
    console.log(`Error fetching homework: ${err}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ============ ACCESSORIES ENDPOINTS ============

app.post("/make-server-3da92bbe/accessories", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization required" }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const orderId = `order:${Date.now()}:${user.id}`;
    
    const order = {
      id: orderId,
      userId: user.id,
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    await kv.set(orderId, order);

    return c.json({ success: true, order });
  } catch (err) {
    console.log(`Error creating order: ${err}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.get("/make-server-3da92bbe/accessories/catalog", async (c) => {
  try {
    const catalog = await kv.get('accessories:catalog') || [];
    return c.json({ success: true, catalog });
  } catch (err) {
    console.log(`Error fetching catalog: ${err}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ============ FEES ENDPOINTS ============

app.post("/make-server-3da92bbe/fees/payment", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization required" }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const paymentId = `payment:${Date.now()}:${user.id}`;
    
    const payment = {
      id: paymentId,
      userId: user.id,
      ...body,
      status: 'completed',
      paidAt: new Date().toISOString()
    };

    await kv.set(paymentId, payment);

    return c.json({ success: true, payment });
  } catch (err) {
    console.log(`Error processing payment: ${err}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.get("/make-server-3da92bbe/fees/:studentId", async (c) => {
  try {
    const studentId = c.req.param('studentId');
    const payments = await kv.getByPrefix(`payment:`) || [];
    const studentPayments = payments.filter((p: any) => p.userId === studentId);
    return c.json({ success: true, payments: studentPayments });
  } catch (err) {
    console.log(`Error fetching fees: ${err}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ============ EXAMS ENDPOINTS ============

app.post("/make-server-3da92bbe/exams", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization required" }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    if (userProfile?.role !== 'admin' && userProfile?.role !== 'teacher') {
      return c.json({ error: "Admin/Teacher access required" }, 403);
    }

    const body = await c.req.json();
    const examId = `exam:${body.studentId}:${Date.now()}`;
    
    const exam = {
      id: examId,
      ...body,
      uploadedBy: user.id,
      uploadedAt: new Date().toISOString()
    };

    await kv.set(examId, exam);

    return c.json({ success: true, exam });
  } catch (err) {
    console.log(`Error uploading exam results: ${err}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.get("/make-server-3da92bbe/exams/:studentId", async (c) => {
  try {
    const studentId = c.req.param('studentId');
    const exams = await kv.getByPrefix(`exam:${studentId}:`);
    return c.json({ success: true, exams });
  } catch (err) {
    console.log(`Error fetching exams: ${err}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ============ TRANSPORT ENDPOINTS ============

app.get("/make-server-3da92bbe/transport/routes", async (c) => {
  try {
    const routes = await kv.get('transport:routes') || [];
    return c.json({ success: true, routes });
  } catch (err) {
    console.log(`Error fetching routes: ${err}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

Deno.serve(app.fetch);

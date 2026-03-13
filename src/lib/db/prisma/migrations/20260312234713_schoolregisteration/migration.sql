-- CreateTable
CREATE TABLE "SchoolRegistration" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "numStudents" INTEGER NOT NULL,
    "schoolName" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "medium" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "schoolId" INTEGER NOT NULL,

    CONSTRAINT "SchoolRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SchoolRegistration_email_key" ON "SchoolRegistration"("email");

-- AddForeignKey
ALTER TABLE "SchoolRegistration" ADD CONSTRAINT "SchoolRegistration_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolRegistration" ADD CONSTRAINT "SchoolRegistration_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

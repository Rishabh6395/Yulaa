"use client"
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RegisterForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter()
    const redirectLink = () => {
        router.push('/login')
    }
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [schoolname, setSchoolname] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const [state, setState] = useState('')
    const [countsOfStudents, setCountsOfStudents] = useState('')
    const [medium, setMedium] = useState('')
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Register your School</CardTitle>
        <CardDescription>
          Enter your information below to register your school
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input id="name" type="text" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)}/>
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <div className="grid grid-cols-2 gap-4 items-center">
            <Select value={role} onValueChange={setRole}>
              <Field>
                <FieldLabel>Role at School</FieldLabel>
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Select a Role" />
              </SelectTrigger>
            </Field>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Role</SelectLabel>
                  <SelectItem value="Teacher">Teacher</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Principal">Principal</SelectItem>
                  <SelectItem value="Vice Pricipal">Vice Pricipal</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* students count */}
            <Select value={countsOfStudents} onValueChange={setCountsOfStudents}>
              <Field>
                <FieldLabel>No. of Students</FieldLabel>
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Select headcount" />
              </SelectTrigger>
            </Field>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Counts</SelectLabel>
                  <SelectItem value="Less than 300">Less than 300</SelectItem>
                  <SelectItem value="300-500">300-500</SelectItem>
                  <SelectItem value="more than 500">more than 500</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            </div>

            <Field>
              <FieldLabel htmlFor="schoolname">School Name</FieldLabel>
              <Input id="school" type="text" placeholder="Enter Full School Name" required  value={schoolname} onChange={(e) => setSchoolname(e.target.value)}/>
            </Field>

            {/* States: */}
            <div className="grid grid-cols-2 gap-4 items-center">
            <Select value={state} onValueChange={setState}>
              <Field>
                <FieldLabel>School at which state</FieldLabel>
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
            </Field>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>States</SelectLabel>
                  <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                  <SelectItem value="Arunachal Pradesh">Arunachal Pradesh</SelectItem>
                  <SelectItem value="Assam">Assam</SelectItem>
                  <SelectItem value="Bihar">Bihar</SelectItem>
                  <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
                  <SelectItem value="Goa">Goa</SelectItem>
                  <SelectItem value="Gujarat">Gujarat</SelectItem>
                  <SelectItem value="Haryana">Haryana</SelectItem>
                  <SelectItem value="Himachal Pradesh">Himachal Pradesh</SelectItem>
                  <SelectItem value="Jharkhand">Jharkhand</SelectItem>
                  <SelectItem value="Karnataka">Karnataka</SelectItem>
                  <SelectItem value="Kerala">Kerala</SelectItem>
                  <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                  <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="Manipur">Manipur</SelectItem>
                  <SelectItem value="Meghalaya">Meghalaya</SelectItem>
                  <SelectItem value="Mizoram">Mizoram</SelectItem>
                  <SelectItem value="Nagaland">Nagaland</SelectItem>
                  <SelectItem value="Odisha">Odisha</SelectItem>
                  <SelectItem value="Punjab">Punjab</SelectItem>
                  <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                  <SelectItem value="Sikkim">Sikkim</SelectItem>
                  <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="Telangana">Telangana</SelectItem>
                  <SelectItem value="Tripura">Tripura</SelectItem>
                  <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                  <SelectItem value="Uttarakhand">Uttarakhand</SelectItem>
                  <SelectItem value="West Bengal">West Bengal</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Medium of school */}
            <Select value={medium} onValueChange={setMedium}>
              <Field>
                <FieldLabel>Medium of your school</FieldLabel>
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Select a Role" />
              </SelectTrigger>
            </Field>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Mediums</SelectLabel>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="Other Medium">Other Medium</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            </div>
            <FieldGroup className="mx-auto w-full">
              <Field orientation="horizontal">
                <Checkbox
                  id="terms-checkbox-desc"
                  name="terms-checkbox-desc"
                  defaultChecked
                />
                <FieldContent>
                  <FieldLabel htmlFor="terms-checkbox-desc">
                    Accept terms and conditions
                  </FieldLabel>
                  <FieldDescription>
                    I agree to receive communications by WhatsApp/SMS/Email
                  </FieldDescription>
                </FieldContent>
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <Button type="submit">Register</Button>
                {/* <Button variant="outline" type="button">
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <button onClick={redirectLink}>Sign in</button>
                </FieldDescription> */}
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

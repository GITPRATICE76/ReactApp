import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function CreateAccount() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [team, setTeam] = useState("");

  const getTeams = () => {
    if (department === "QA") return ["QA"];
    if (department === "DEVELOPMENT")
      return ["REACT", "BACKEND", "WEB", "DB"];
    return [];
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create Employee
          </CardTitle>
          <CardDescription>
            Enter employee details
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              placeholder="Employee name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              placeholder="email@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <Label>Department</Label>
            <select
              className="w-full border rounded-md p-2"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setTeam("");
              }}
            >
              <option value="">Select Department</option>
              <option value="QA">QA</option>
              <option value="DEVELOPMENT">Development</option>
            </select>
          </div>

          <div>
            <Label>Team</Label>
            <select
              className="w-full border rounded-md p-2"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              disabled={!department}
            >
              <option value="">Select Team</option>
              {getTeams().map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full">
            Create Employee
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const InstructorDashboard = ({ listOfCourses = [] }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [listOfCourses]);

  const totalRevenue = listOfCourses.reduce((sum, course) => sum + course.students.length * course.pricing, 0);
  const totalStudents = listOfCourses.reduce((sum, course) => sum + course.students.length, 0);

  const revenueData = listOfCourses.map(course => ({
    title: course.title,
    value: course.students.length * course.pricing,
  }));

  const performanceData = listOfCourses.map(course => ({
    title: course.title,
    value: course.students.length,
  }));

  const calculatedData = listOfCourses.reduce(
    (acc, course) => {
      const studentCount = course.students.length;
      acc.totalStudents += studentCount;
      acc.totalProfit += course.pricing * studentCount;

      course.students.forEach((student) => {
        acc.studentList.push({
          courseTitle: course.title,
          studentName: student.studentName,
          studentEmail: student.studentEmail,
        });
      });

      return acc;
    },
    {
      totalStudents: 0,
      totalProfit: 0,
      studentList: [],
    }
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="mt-6 bg-white shadow rounded-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent>
              <h2 className="text-sm font-medium text-gray-500 py-2">Total Revenue</h2>
              <p className="text-xl font-semibold text-gray-800">${totalRevenue}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="text-sm font-medium text-gray-500 py-2">Total Students</h2>
              <p className="text-xl font-semibold text-gray-800">{totalStudents}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="text-sm font-medium text-gray-500 py-2">Courses Created</h2>
              <p className="text-xl font-semibold text-gray-800">{listOfCourses.length}</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-gray-500">Loading revenue data...</p>
              ) : listOfCourses.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
                    <XAxis dataKey="title" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#000" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-gray-500">No revenue data available</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Courses Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-gray-500">Loading performance data...</p>
              ) : listOfCourses.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
                    <XAxis dataKey="title" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#000" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-gray-500">No performance data available</p>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="mt-6 bg-white shadow rounded-lg p-4">
          <h2 className="text-sm font-medium text-gray-500 mb-4">Course Revenue Overview</h2>
          <div className="max-h-[300px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Students</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listOfCourses.length > 0 ? (
                  listOfCourses.map((course, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>${course.students.length * course.pricing}</TableCell>
                      <TableCell>{course.students.length}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="text-center">No courses available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        <Card className="mt-6 bg-white shadow rounded-lg p-4">
          <CardHeader>
            <CardTitle>Students List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[300px] overflow-y-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Student Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calculatedData.studentList.length > 0 ? (
                    calculatedData.studentList.map((studentItem, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{studentItem.courseTitle}</TableCell>
                        <TableCell>{studentItem.studentName}</TableCell>
                        <TableCell>{studentItem.studentEmail}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell className="text-center">No student data available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default InstructorDashboard;

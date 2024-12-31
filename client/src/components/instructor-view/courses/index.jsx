import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AuthContext } from '@/context/auth-context';
import { InstructorContext } from '@/context/instructor-context';
import CourseList from '@/pages/student/courses/CourseList';
import { Edit } from 'lucide-react';
import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';

const InstructorCourses = ({ listOfCourses }) => {

  const {
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const {
    navigate,
    isLoading,
    setProgress,
  } = useContext(AuthContext);

  return (
    <>
      <Card className='m-1 mb-5'>
        <CardHeader className='flex justify-between flex-row items-center'>
          <CardTitle className='text-3xl font-extrabold'>Your Courses</CardTitle>
          <Button
            onClick={() => {
              setCurrentEditedCourseId(null);
              navigate('/instructor/create-new-course')
            }}
            className='py-6 font-bold'>
            Create New Course
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  listOfCourses && listOfCourses.length > 0 ?
                    listOfCourses.map((Course, index) =>
                      <TableRow key={index}>
                        <TableCell className="font-medium">{Course?.title}</TableCell>
                        <TableCell>{Course?.students?.length}</TableCell>
                        <TableCell>{Course?.students?.length * Course?.pricing}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => {
                              navigate(`/instructor/edit-course/${Course?._id}`)
                            }}
                          >
                            <Edit className='h-6 w-6' />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow>
                        <TableCell colSpan="4" className="text-center py-4">
                          No courses available
                        </TableCell>
                      </TableRow>
                    )
                }
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Routes>
        <Route
          path=''
          element=
          {<CourseList isLoading={isLoading} courseList={listOfCourses} />}
        />
        </Routes>
      </>
      );
}

      export default InstructorCourses;

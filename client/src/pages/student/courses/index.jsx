import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { filterOptions, sortOptions } from '@/config';
import { AuthContext } from '@/context/auth-context';
import { StudentContext } from '@/context/student-context';
import { ArrowUpDownIcon } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import CourseList from './CourseList';
import { toast } from 'react-toastify';
import { fetchStudentViewCourseListService } from '@/services';

const StudentViewCoursesPage = () => {
    const { 
        studentViewCoursesList,
        setStudentViewCoursesList,
     } = useContext(StudentContext);
    const [sort, setSort] = useState('');
    const { isLoading, setProgress } = useContext(AuthContext)
    const [filters, setFilters] = useState({});

    const selectedSortLabel = sortOptions.find(option => option.id === sort)?.label || 'Sort By';

    function handleFilterOnChange(getSectionId, getCurrentOption) {
        let cpyFilters = { ...filters };
        const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

        if (indexOfCurrentSection === -1) {
            cpyFilters = {
                ...cpyFilters,
                [getSectionId]: [getCurrentOption.id],
            };
        } else {
            const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption.id);
            if (indexOfCurrentOption === -1)
                cpyFilters[getSectionId].push(getCurrentOption.id);
            else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
        }

        setFilters(cpyFilters);


        // Generate a readable query string without over-encoding
        const queryString = Object.entries(cpyFilters)
            .map(
                ([key, values]) =>
                    `${key}=${values.map(value => `${value}`).join('+')}`
            )
            .join('&');

        // Update the URL without encoding unnecessary characters
        const newUrl = `?${queryString}`;
        window.history.pushState(null, '', newUrl);
    }

    async function fetchAllStudentViewCourses(filters, sort) {
            const query = new URLSearchParams({
                ...filters,
                sortBy: sort
            })
            setProgress(30); // Set isLoading to true when fetching starts
            try {
                const response = await fetchStudentViewCourseListService(query);
                if (response?.success) {
                    setStudentViewCoursesList(response?.data);
                } else {
                    toast.error(response.message);
                }
            } catch (err) {
                toast.error(err.response.message);
            } finally {
                setProgress(100); // Set isLoading to false once fetching is complete
            }
        }
    
        useEffect(() => {
            if (filters !== null && sort !== null) {
                fetchAllStudentViewCourses(filters, sort);
            }
        }, [filters, sort]); // Re-fetch courses when filters or sort change

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const queryString = queryParams.toString();
    
        if (queryString) {
            const pairs = queryString.split('&');
            const obj = {};
    
            pairs.forEach(pair => {
                const [key, value] = pair.split('=');
                obj[key] = value.split('+');
            });
    
            setFilters(obj);
        }
    }, []);    
    // Runs once when the component mounts or when URL changes    

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold m-4">All Courses</h1>
            <div className="flex flex-col md:flex-row gap-4">
                <aside className="w-full md:w-64 space-y-4">
                    <div className="space-y-4 h-[73vh] overflow-y-scroll">
                        {Object.keys(filterOptions).map((keyItem) => (
                            <div className="p-4 border-t" key={keyItem}>
                                <h3 className="font-bold mb-3">
                                    {keyItem.toUpperCase() === 'PRIMARYLANGUAGE'
                                        ? 'PRIMARY LANGUAGE'
                                        : keyItem.toUpperCase()}
                                </h3>
                                <div className="grid gap-2 mt-2">
                                    {filterOptions[keyItem].map(option => (
                                        <Label className="flex font-medium items-center gap-3 cursor-pointer" key={option.id}>
                                            <Checkbox
                                                checked={
                                                    filters &&
                                                    Object.keys(filters).length > 0 &&
                                                    filters[keyItem] &&
                                                    filters[keyItem].indexOf(option.id) > -1
                                                }
                                                onCheckedChange={() => handleFilterOnChange(keyItem, option)}
                                            />
                                            {option.label}
                                        </Label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
                <main className="flex-1 h-[73vh] overflow-y-scroll">
                    <div className="flex justify-end items-center mb-4 gap-5">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-2 p-5">
                                    <ArrowUpDownIcon className="h-4 w-4" />
                                    <span className="text-[16px] font-medium">{selectedSortLabel}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px]">
                                <DropdownMenuRadioGroup value={sort} onValueChange={(value) => setSort(value)}>
                                    {sortOptions.map(sortItem => (
                                        <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
                                            {sortItem.label}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <span className="text-sm text-black-900 font-bold">
                            {isLoading ? 'Loading...' : `${studentViewCoursesList.length} ${studentViewCoursesList.length>1?'results':'result'}`}
                        </span>
                    </div>
                    <Routes>
                        <Route
                            path=''
                            element={<CourseList isLoading={isLoading} courseList={studentViewCoursesList} />}
                        />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default StudentViewCoursesPage;

import React, { useEffect, useState } from 'react';
import { SideBarProfile } from '@/components/SideBarProfile';
import { Button, Card, CardContent, Typography, Avatar, IconButton, Pagination, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export const ChildrenProfile = () => {
  const [children, setChildren] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch('https://66722715e083e62ee43e2228.mockapi.io/Children')
      .then((response) => response.json())
      .then((data) => setChildren(data))
      .catch((error) => console.error('Error fetching children:', error));
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(children.length / itemsPerPage);
  const indexOfLastChild = currentPage * itemsPerPage;
  const indexOfFirstChild = indexOfLastChild - itemsPerPage;
  const currentChildren = children.slice(indexOfFirstChild, indexOfLastChild);

  return (
    <div className='flex'>
      <SideBarProfile />
      <div className='p-4 w-full bg-[#f9f9f9]'>
        {/* Header Section with Title and Add Button */}
        <div className='flex justify-between items-center mb-4'>
          <Typography variant="h5" fontWeight="bold">Children List</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => alert('Add child functionality goes here')}
          >
            Add Child
          </Button>
        </div>

        {/* List of Children */}
        <Stack spacing={2}>
          {currentChildren.map((child) => (
            <Card key={child.id} sx={{ display: 'flex', alignItems: 'center', padding: 2, boxShadow: 3 }}>
              <Avatar src={child.picture} alt={child.fname} sx={{ width: 56, height: 56, marginRight: 2 }} />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{child.fname} {child.lname}</Typography>
              </CardContent>
              {/* Show Details Button Aligned to the Right */}
              <Button 
                color="primary" 
                onClick={() => alert(`Showing details for ${child.fname} ${child.lname}`)}
              >
                Show Details <NavigateNextIcon/>
              </Button>
            </Card>
          ))}
        </Stack>

        {/* Pagination Controls */}
        <Stack direction="row" justifyContent="center" alignItems="center" mt={3}>
          <Pagination 
            count={totalPages} 
            page={currentPage} 
            onChange={(event, value) => setCurrentPage(value)} 
            color="primary" 
          />
        </Stack>
      </div>
    </div>
  );
};

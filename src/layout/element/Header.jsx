import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import React from 'react';

const Header = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Container maxWidth="xl">
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Dotudy
                    </Typography>
                </Container>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
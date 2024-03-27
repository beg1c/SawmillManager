import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const FullLoader = () => {
    return (
        <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
        </Box>
    );
};

export default FullLoader;
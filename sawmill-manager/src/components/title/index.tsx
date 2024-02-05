import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import { SawmillManagerIcon } from "../icons/sawmill-manager";
import { CarpenterIcon } from "../icons/carpenter";

type TitleProps = {
    collapsed: boolean;
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
    return (
        <Link to="/">
            <Box
                sx={{
                    height: "72px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "text.primary",
                }}
            >
                {collapsed ? <CarpenterIcon /> : <SawmillManagerIcon />}
            </Box>
        </Link>
    );
};
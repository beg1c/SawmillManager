import { useState } from "react";
import { useTranslate, BaseKey, useDelete } from "@refinedev/core";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import { IWaste } from "../../interfaces/interfaces";
import { Avatar, Stack } from "@mui/material";
import { ForestSharp, InventoryRounded, RecyclingSharp } from "@mui/icons-material";

type WasteItem = {
    waste: IWaste;
    show: (id: BaseKey) => void;
};

export const WasteItem: React.FC<WasteItem> = ({
    waste,
    show,
}) => {

    const t = useTranslate();
    const { id, name, description, unit_of_measure, price, photo } = waste;

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const popoverId = open ? "simple-popover" : undefined;

    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
                height: "100%",
            }}
        >
            <CardHeader
                action={
                    <Box component="div">
                        <IconButton
                            aria-describedby={popoverId}
                            onClick={handleClick}
                            sx={{ marginRight: "10px", marginTop: "4px" }}
                            aria-label="settings"
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Popover
                            id={popoverId}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                        >
                            <Stack
                                alignItems="start"
                            >
                                <Button
                                    onClick={() => {
                                        show(id);
                                        setAnchorEl(null);
                                    }}
                                    size="small"
                                    startIcon={<EditIcon />}
                                    sx={{
                                        padding: "5px 10px",
                                    }}
                                >
                                    {t("wastes.titles.edit")}
                                </Button>
                                {/* <Button
                                    onClick={() => {
                                        mutateDelete({
                                            resource: "wastes",
                                            id: id,
                                            mutationMode: "undoable",
                                            undoableTimeout: 10000,
                                        });
                                    }}
                                    size="small"
                                    color="error"
                                    startIcon={<Close />}
                                    sx={{
                                        padding: "5px 10px",
                                    }}
                                >
                                    {"Delete Waste"}
                                </Button> */}
                            </Stack>
                        </Popover>
                    </Box>
                }
                sx={{ padding: 0 }}
            />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Avatar
                    sx={{
                        width: { xs: 144, xl: 200 },
                        height: { xs: 144, xl: 200 },
                    }}
                    alt={name}
                    src={photo}
                >
                    <RecyclingSharp sx={{ fontSize: 80 }} />
                </Avatar>
            </Box>           
            <CardContent
                sx={{
                    paddingX: "36px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                }}
            >
                <Divider />
                <Box
                    display="flex"
                    justifyContent="space-between"
                >
                <Stack>
                    <Tooltip title={name}>
                        <Typography
                            sx={{
                                fontWeight: 800,
                                fontSize: "18px",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {name}
                        </Typography>
                    </Tooltip>
                    <Tooltip title={description}>
                        <Typography
                            variant="body2"
                            sx={{
                                mt: 2,
                                overflowWrap: "break-word",
                                color: "text.secondary",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: "3",
                                WebkitBoxOrient: "vertical",
                                flex: 1,
                            }}
                        >
                            {description}
                        </Typography>
                    </Tooltip>
                </Stack>
                <Stack>
                    <Tooltip title={`${price} €`} placement="top">
                        <Typography
                            sx={{
                                fontWeight: 700,
                                fontSize: "22px",
                                overflowWrap: "break-word",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                            }}
                        >{`${price} €`}</Typography>
                    </Tooltip>
                    <Typography
                        sx={{
                            minWidth: 60,
                            fontWeight: 400,
                            fontSize: "16px",
                            overflowWrap: "break-word",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                        }}
                    >{`per ${unit_of_measure}`}</Typography>
                </Stack>
                </Box>
            </CardContent>
        </Card>
    );
};
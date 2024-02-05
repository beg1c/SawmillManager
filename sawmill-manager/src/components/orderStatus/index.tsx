import { useTranslate } from "@refinedev/core";
import { useTheme } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import type { ChipProps } from "@mui/material/Chip";

type OrderStatusProps = {
    status?: "Pending" | "Ready"  | "Dispatched" | "Cancelled";
};

export const OrderStatus: React.FC<OrderStatusProps> = ({ status }) => {
    const t = useTranslate();
    const { palette } = useTheme();

    let color: ChipProps["color"];

    switch (status) {
        case "Pending":
            color = "warning";
            break;
        case "Ready":
            color = "success";
            break;
        case "Dispatched":
            color = palette.mode === "dark" ? "default" : "secondary";
            break;
        case "Cancelled":
            color = "error";
            break;
    }

    return (
        <Chip
            variant="outlined"
            size="small"
            color={color}
            label={t(`enum.orderStatuses.${status}`)}
        />
    );
};
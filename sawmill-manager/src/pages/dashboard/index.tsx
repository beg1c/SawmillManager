import { useApiUrl, useCustom, useTranslate } from "@refinedev/core";
import { BiggestCustomers } from "../../components/dashboard/biggestCustomers"
import { ICustomerWTotalSpent, IDailyProductivity, IProductWQuantity } from "../../interfaces/interfaces";
import { RefineListView } from "../../components/refine-list-view";
import { Grid } from "@mui/material";
import { Card } from "../../components/card";
import { ListAltOutlined, LocalGroceryStoreOutlined, MonetizationOnOutlined, PeopleAltOutlined, ShoppingBagOutlined } from "@mui/icons-material/";
import { PendingOrders } from "../../components/dashboard/pendingOrders";
import { RecentDailyLogs } from "../../components/dashboard/recentDailyLogs";
import { MostSoldProducts } from "../../components/dashboard/mostSoldProducts";
import { ClosestServices } from "../../components/dashboard/closestServices";
import { DailyProductivity } from "../../components/dashboard/dailyProductivity";


export const DashboardPage: React.FC = () => {
    const t = useTranslate();
    const apiUrl = useApiUrl();
    
    const { data: biggestCustomersData } = useCustom<{
        data: ICustomerWTotalSpent[];
        total: number;
      }>({
        url: `${apiUrl}/dashboard/get-biggest-customers`,
        method: "get",
      });

    const biggestCustomers = biggestCustomersData?.data.data;

    const { data: mostSoldProductsData } = useCustom<{
        data: IProductWQuantity[];
        total: number;
      }>({
        url: `${apiUrl}/dashboard/get-most-sold-products`,
        method: "get",
      });

    const mostSoldProducts = mostSoldProductsData?.data.data;

    const { data: dailyProductivityData } = useCustom<{
        data: IDailyProductivity[];
        total: number;
      }>({
        url: `${apiUrl}/dashboard/get-daily-productivity`,
        method: "get",
      });

    const dailyProductivity = dailyProductivityData?.data.data;

    return (
        <RefineListView>
            <Grid container columns={24} spacing={3}>
            <Grid
                item
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={10}
                sx={{
                height: "350px",
                }}
            >
                <Card
                title={t("dashboard.pendingOrders.title")}
                icon={<ListAltOutlined />}
                sx={{
                    ".MuiCardContent-root:last-child": {
                    paddingBottom: "24px",
                    },
                }}
                cardContentProps={{
                    sx: {
                    height: "294px",
                    },
                }}
                >
                    <PendingOrders />
                </Card>
            </Grid>
            <Grid
                item
                xs={24}
                sm={24}
                md={24}
                lg={12}
                xl={7}
                sx={{
                height: "350px",
                }}
            >
                <Card
                title={t("dashboard.mostSoldProducts.title")}
                icon={<LocalGroceryStoreOutlined />}
                sx={{
                    ".MuiCardContent-root:last-child": {
                    paddingBottom: "24px",
                    },
                }}
                cardContentProps={{
                    sx: {
                    height: "294px",
                    },
                }}
                >
                    <MostSoldProducts products={mostSoldProducts || []} />
                </Card>
            </Grid>
            <Grid
                item
                xs={24}
                sm={24}
                md={24}
                lg={12}
                xl={7}
                sx={{
                height: "350px",
                }}
            >
                <Card
                title={t("dashboard.biggestCustomers.title")}
                icon={<PeopleAltOutlined />}
                sx={{
                    ".MuiCardContent-root:last-child": {
                    paddingBottom: "24px",
                    },
                }}
                cardContentProps={{
                    sx: {
                    height: "294px",
                    },
                }}
                > 
                    <BiggestCustomers customers={biggestCustomers || []} />
                </Card>
            </Grid>
            <Grid
                item
                xs={24}
                sm={24}
                md={24}
                lg={15}
                xl={15}
                sx={{
                height: "504px",
                }}
            >
                <Card
                title={t("dashboard.dailyProductivity.title")}
                cardContentProps={{
                    sx: {
                    height: "424px",
                    },
                }}
                >
                    <DailyProductivity dailyProductivity={dailyProductivity || []} />
                </Card>
            </Grid>
            <Grid
                item
                xs={24}
                sm={24}
                md={24}
                lg={9}
                xl={9}
                sx={{
                height: "504px",
                }}
            >
                <Card
                title={t("dashboard.closestServices.title")}
                >
                </Card>
            </Grid>
            <Grid
                item
                xs={24}
                sm={24}
                md={24}
                lg={9}
                xl={9}
                sx={{
                height: "504px",
                }}
            >
                <Card
                title={t("dashboard.closestServices.title")}
                >
                    <ClosestServices />
                </Card>
            </Grid>
            <Grid
                item
                xs={24}
                sm={24}
                md={24}
                lg={15}
                xl={15}
                sx={{
                height: "504px",
                }}
            >
                <Card
                title={t("dashboard.recentDailyLogs.title")}
                cardContentProps={{
                    sx: {
                    height: "504px",
                    },
                }}
                >
                    <RecentDailyLogs />
                </Card>
            </Grid>
            </Grid>
        </RefineListView>
    );
};
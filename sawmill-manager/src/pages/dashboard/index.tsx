import { useApiUrl, useCustom, useTranslate } from "@refinedev/core";
import { BiggestCustomers } from "../../components/dashboard/biggestCustomers"
import { ICustomerWTotalSpent } from "../../interfaces/interfaces";
import { RefineListView } from "../../components/refine-list-view";
import { Grid } from "@mui/material";
import { Card } from "../../components/card";
import { MonetizationOnOutlined, ShoppingBagOutlined } from "@mui/icons-material/";
import { PendingOrders } from "../../components/dashboard/pendingOrders";
import { RecentDailyLogs } from "../../components/dashboard/recentDailyLogs";


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
            icon={<MonetizationOnOutlined />}
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
            icon={<MonetizationOnOutlined />}
            cardContentProps={{
                sx: {
                height: "294px",
                },
            }}
            >
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
            icon={<ShoppingBagOutlined />}
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
            title={t("dashboard.recentTasks.title")}
            >
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
            height: "800px",
            }}
        >
            <Card
            title={t("dashboard.recentDailyLogs.title")}
            cardContentProps={{
                sx: {
                height: "688px",
                },
            }}
            >
                <RecentDailyLogs />
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
            height: "max-content",
            }}
        >
            <Card
            title={t("dashboard.closeServices.title")}
            >
            </Card>
        </Grid>
        </Grid>
    </RefineListView>
  );
};
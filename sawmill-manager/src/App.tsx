import { Authenticated, I18nProvider, Refine, useGetIdentity, useModal } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  RefineSnackbarProvider,
  ThemedLayoutV2,
  useNotificationProvider,
} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { dataProvider } from "./rest-data-provider/";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider } from "./providers/authProvider";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { EmployeeShow } from "./pages/employees/show";
import { EmployeeEdit } from "./pages/employees/edit";
import { EmployeeCreate } from "./pages/employees/create";
import { EmployeeList } from "./pages/employees/list";
import { EquipmentList } from "./pages/equipment/list";
import { EquipmentEdit } from "./pages/equipment/edit";
import { EquipmentCreate } from "./pages/equipment/create";
import { Title } from "./components/title";
import { accessControlProvider } from "./providers/accessControlProvider";
import { OrderList } from "./pages/orders/list";
import { ProductList } from "./pages/products/list";
import { SawmillList } from "./pages/sawmills/list";
import { useTranslation } from "react-i18next";
import { CustomerList } from "./pages/customers";
import { OrderShow } from "./pages/orders";
import { BadgeOutlined, BusinessOutlined, Calculate, Dashboard, HomeRepairServiceOutlined, Inventory2Outlined, ListAltOutlined, PeopleAltOutlined, TextSnippet } from "@mui/icons-material";
import { MaterialList } from "./pages/materials";
import { WasteList } from "./pages/waste";
import { DailyLogList, DailyLogShow } from "./pages/dailyLogs";
import { DashboardPage } from "./pages/dashboard";
import { InventoryList, InventoryShow } from "./pages/inventory";
import { Fab } from "@mui/material";
import { CalculatorDrawer } from "./components/calculator";
const apiUrl = import.meta.env.VITE_APP_API_URL;

function App() {
  const { t, i18n } = useTranslation();
  const i18nProvider: I18nProvider = {
      // @ts-ignore
      translate: (key: string, options?: any) => t(key, options),     
      changeLocale: (lang: string) => i18n.changeLanguage(lang),
      getLocale: () => i18n.language,
  };

  const calculatorDrawerProps = useModal();
  const { show: showCalculatorDrawer } = calculatorDrawerProps;

  return (
    <BrowserRouter>
      <DocumentTitleHandler handler={() => "SawmillManager"}/>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <Refine
              dataProvider={dataProvider(apiUrl)}
              notificationProvider={useNotificationProvider}
              authProvider={authProvider}
              accessControlProvider={accessControlProvider}
              routerProvider={routerBindings}
              i18nProvider={i18nProvider}
              resources={[
                {
                  name: "dashboard",
                  list: "/dashboard",
                  meta: {
                    label: 'Dashboard',
                    icon: <Dashboard />,
                    canDelete: true,
                  },
                },
                {
                  name: "orders",
                  list: "/orders",
                  show: "/orders/show/:id",
                  meta: {
                    icon: <ListAltOutlined />,
                    canDelete: true,
                  },
                },
                {
                  name: "dailylogs",
                  list: "/dailylogs",
                  show: "/dailylogs/show/:id",
                  meta: {
                    label: 'Daily logs',
                    icon: <TextSnippet />,
                    canDelete: true,
                  },
                },
                {
                  name: "inventory",
                  meta: { 
                    icon: <Inventory2Outlined />,
                    label: "Inventory" 
                  },
                  list: "/inventory",
                  show: "/inventory/show/:id"
                },
                {
                  name: "customers",
                  list: "/customers",
                  meta: {
                    icon: <PeopleAltOutlined />,
                    canDelete: true,
                  },
                },
                {
                  name: "roles",
                  list: "/roles",
                },
                {
                  name: "equipment",
                  list: "/equipment",
                  create: "/equipment/create",
                  edit: "/equipment/edit/:id",
                  meta: {
                    icon: <HomeRepairServiceOutlined />,
                    canDelete: true,
                  },
                },
                {
                  name: "employees",
                  list: "/employees",
                  create: "/employees/create",
                  edit: "/employees/edit/:id",
                  show: "/employees/show/:id",
                  meta: {
                    icon: <BadgeOutlined />,
                    canDelete: true,
                  },
                },
                {
                  name: "manage-products",
                  list: "/products",
                  meta: { 
                    hide: true,
                  },
                },
                {
                  name: "manage-materials",
                  list: "/materials",
                  meta: { 
                    hide: true,
                  },
                },
                {
                  name: "manage-wastes",
                  list: "/wastes",
                  meta: { 
                    hide: true,
                  },
                },
                {
                  name: "sawmills",
                  list: "/sawmills",
                  meta: {
                    icon: <BusinessOutlined />,
                    canDelete: true,
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: "D7Nuqm-Rnj72y-bhjE66",
              }}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-inner"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <ThemedLayoutV2
                        Header={() => <Header sticky />}
                        Title={Title}
                        OffLayoutArea={() => (  
                          <>
                            <Fab  
                              size="large"  
                              color="primary"  
                              sx={{  
                              position: "fixed",  
                              bottom: "16px",  
                              right: "16px",  
                              }}  
                              onClick={showCalculatorDrawer} 
                              variant="extended"   
                            >  
                              <Calculate fontSize="medium" sx={{ marginRight: 0.5 }}/>Calculator
                            </Fab> 
                          </>
                          )}  
                      >
                      <CalculatorDrawer {...calculatorDrawerProps}/> 
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route
                    index
                    element={<NavigateToResource resource="dashboard"/>}
                  />
                  <Route path="/dashboard">
                    <Route index element={<DashboardPage />} />
                  </Route>
                  <Route path="/customers">
                    <Route index element={<CustomerList />} />
                  </Route>
                  <Route path="/dailylogs">
                    <Route index element={<DailyLogList />} />
                    <Route path="show/:id" element={<DailyLogShow />} />
                  </Route>
                  <Route path="/equipment">
                    <Route index element={<EquipmentList />} />
                    <Route path="create" element={<EquipmentCreate />} />
                    <Route path="edit/:id" element={<EquipmentEdit />} />
                  </Route>
                  <Route path="/employees">
                    <Route index element={<EmployeeList />} />
                    <Route path="create" element={<EmployeeCreate />} />
                    <Route path="edit/:id" element={<EmployeeEdit />} />
                    <Route path="show/:id" element={<EmployeeShow />} />
                  </Route>
                  <Route path="/orders">
                    <Route index element={<OrderList />} />
                    <Route path="show/:id" element={<OrderShow />} />
                  </Route>
                  <Route path="/inventory">
                    <Route index element={<InventoryList />} />
                    <Route path="show/:id" element={<InventoryShow />} />
                  </Route>
                  <Route path="/products">
                    <Route index element={<ProductList />} />
                  </Route>
                  <Route path="/materials">
                    <Route index element={<MaterialList />} />
                  </Route>
                  <Route path="/wastes">
                    <Route index element={<WasteList />} />
                  </Route>
                  <Route path="/sawmills">
                    <Route index element={<SawmillList />} />
                  </Route>
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-outer"
                      fallback={<Outlet />}
                    >
                      <NavigateToResource />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                  />
                </Route>
              </Routes>
              <RefineKbar />
              <UnsavedChangesNotifier />
            </Refine>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;

import { Avatar, Box, Grid, Paper, Stack, Typography, useTheme } from "@mui/material";
import { green } from "@mui/material/colors";
import { IResourceComponentsProps, useGo, useShow } from "@refinedev/core";
import {
  DeleteButton,
  EditButton,
} from "@refinedev/mui";
import { IEmployee } from "../../interfaces/interfaces";
import { CalendarMonth, LocalPhoneOutlined, MailOutlined, PersonOutlined, WorkOutline } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { RotateLoader } from "react-spinners";

type EmployeeInfoTextProps = {
  icon: React.ReactNode;
  text?: string;
};

const EmployeeInfoText: React.FC<EmployeeInfoTextProps> = ({ icon, text }) => (
  <Stack
      direction="row"
      alignItems="center"
      justifyContent={{
          sm: "center",
          lg: "flex-start",
      }}
      gap={1}
  >
      {icon}
      <Typography variant="body1">{text}</Typography>
  </Stack>
);

export const EmployeeShow: React.FC<IResourceComponentsProps> = () => {
  const { t } = useTranslation();
  const { queryResult } = useShow<IEmployee>({});
  const { data, isLoading } = queryResult;
  const { palette } = useTheme();
  const employee = data?.data;
  const go = useGo();

  if (isLoading) {
    return (
        <Grid container justifyContent="center" alignItems="center" style={{ height: '80vh' }}>
          <Grid item>
              <RotateLoader 
                color={palette.primary.main}
                speedMultiplier={0.5}
              />
          </Grid>
        </Grid>
      )
  }

  return (
    <Grid container spacing={2}>
        <Grid item xs={12} lg={4} xl={3}>
            <Paper sx={{ p: 2 }}>
                <Stack alignItems="center" spacing={1}> 
                <Avatar src={employee?.avatar} sx={{ bgcolor: green[500], width: 200, height: 200 }} />
                    <Typography variant="h6">
                        {employee?.name}
                    </Typography>
                </Stack>
                <br />
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                        <EmployeeInfoText
                            icon={<MailOutlined />}
                            text={employee?.email}
                        />
                        <EmployeeInfoText
                            icon={<LocalPhoneOutlined />}
                            text={employee?.contact_number}
                        />
                        <EmployeeInfoText
                            icon={<CalendarMonth />}
                            text={employee?.birthday?.toString()}
                        />
                        <EmployeeInfoText
                            icon={<PersonOutlined />}
                            text={
                              t("roles." + employee?.role.role_name)
                            }
                        />
                        <EmployeeInfoText
                            icon={<WorkOutline />}
                            text={
                              employee?.sawmills?.map(sawmill => sawmill.name).join(', ')
                            }
                        />
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                  <Box display="flex" alignItems="flex-end" justifyContent="flex-end">
                    <EditButton 
                      accessControl={{ enabled: true, hideIfUnauthorized: true }}
                    />
                    <DeleteButton 
                      confirmTitle="Are you sure you want to delete employee?"
                      accessControl={{ enabled: true, hideIfUnauthorized: true }}
                      onSuccess = {() => go({
                        to: {
                          resource: "employees",
                          action: "list",
                        },
                      })}
                    />
                  </Box> 
                  </Grid>
                </Grid>
            </Paper>
        </Grid>
      </Grid>
  )
};

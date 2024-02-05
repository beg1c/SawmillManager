import { useContext } from "react";
import {
    useTranslate,
    useGetIdentity,
    useGetLocale,
    useSetLocale,
    useNavigation,
} from "@refinedev/core";
import { RefineThemedLayoutV2HeaderProps, HamburgerMenu } from "@refinedev/mui";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import i18n from "../../i18n";
import { ColorModeContext } from "../../contexts/color-mode";
import { IEmployee, IIdentity } from "../../interfaces/interfaces";
import { ManageAccountsRounded } from "@mui/icons-material";
import { Button } from "@mui/material";

function showLang(lang: string): string {
  switch (lang) {
      case "en":
        return "English"
      case "de":
        return "German"
      case "hr":
        return "Croatian"
      default:
        return "Unknown language"
  }
}

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = () => {
    const { edit } = useNavigation();
    const { mode, setMode } = useContext(ColorModeContext);

    const changeLanguage = useSetLocale();
    const locale = useGetLocale();
    const currentLocale = locale();
    const { data: user } = useGetIdentity<IEmployee>();

    const t = useTranslate();
    return (
        <AppBar color="default" position="sticky" elevation={1}>
            <Toolbar
                sx={{
                    paddingLeft: {
                        sm: "24px",
                        md: "24px",
                    },
                }}
            >
                <HamburgerMenu />

                <Stack
                    direction="row"
                    width="100%"
                    justifyContent="end"
                    alignItems="center"
                >
                    <Stack direction="row" alignItems="center">
                        <IconButton
                            onClick={() => {
                                setMode();
                            }}
                        >
                            {mode === "dark" ? (
                                <LightModeOutlined />
                            ) : (
                                <DarkModeOutlined />
                            )}
                        </IconButton>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <Select
                                disableUnderline
                                defaultValue={currentLocale}
                                inputProps={{ "aria-label": "Without label" }}
                                variant="standard"
                            >
                                {[...(i18n.languages ?? [])]
                                    .sort()
                                    .map((lang: string) => (
                                        <MenuItem
                                            selected={currentLocale === lang}
                                            key={lang}
                                            defaultValue={lang}
                                            onClick={() => {
                                                changeLanguage(lang);
                                            }}
                                            value={lang}
                                        >
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: "16px",
                                                        height: "16px",
                                                        marginRight: "5px",
                                                    }}
                                                    src={`/images/flags/${lang}.svg`}
                                                />
                                                {
                                                  showLang(lang)
                                                }
                                            </Stack>
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <Stack
                            direction="row"
                            gap="4px"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Button
                                onClick={() => user?.id &&
                                    edit('employees', user.id)
                                }
                            >
                                <Typography variant="subtitle2" marginRight={2}>
                                    {user?.name}
                                </Typography>
                                <Avatar src={user?.avatar}/>
                            </Button>
                          </Stack>
                    </Stack>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};
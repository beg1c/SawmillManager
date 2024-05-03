import { IResourceComponentsProps, useGetIdentity, useNavigation } from "@refinedev/core";
import { IIdentity } from "../../interfaces/interfaces";
import FullLoader from "../../components/fullLoader";
import { useEffect } from "react";

export const InventoryList: React.FC<IResourceComponentsProps> = () => {
    const { data: identity } = useGetIdentity<IIdentity>(); 
    const { show } = useNavigation();

    useEffect(() => {
        if (identity) {
            show('inventory', identity.sawmills[0].id);
        }
    }, [identity]);

    return (
        <FullLoader />
    );
};

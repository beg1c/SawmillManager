import MapWrapper from "../../mapWrapper";

export const DashboardMap: React.FC = () => {
    const defaultProps = {
    center: {
        lat: 45.90239765748584,
        lng: 16.84412464846255
    },
    zoom: 12,
    };

    return (
        <MapWrapper mapProps={{ ...defaultProps }}></MapWrapper>
    );
};
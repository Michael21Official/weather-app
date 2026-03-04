export interface AirPollutionResponse {
    coord: {
        lon: number;
        lat: number;
    };
    list: {
        dt: number;
        main: {
            aqi: number; // 1-Good, 2-Fair, 3-Moderate, 4-Poor, 5-Very Poor
        };
        components: {
            co: number;
            no: number;
            no2: number;
            o3: number;
            so2: number;
            pm2_5: number;
            pm10: number;
            nh3: number;
        };
    }[];
}

export const AQI_LEVELS: { [key: number]: { label: string; color: string } } = {
    1: { label: 'Dobra', color: 'green' },
    2: { label: 'Umiarkowana', color: 'yellow' },
    3: { label: 'Dostateczna', color: 'orange' },
    4: { label: 'Zła', color: 'red' },
    5: { label: 'Bardzo zła', color: 'purple' }
};
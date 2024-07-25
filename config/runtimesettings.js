export const sensors = [
  {
    label: "Sensor 1 (Dining room)",
    namespace: "climate_sensor_1",
    constraints: {
      temperature: {
        min: 20,
        max: 25,
      },
      humidity: {
        min: 50,
        max: 70,
      },
    },
  },
  {
    label: "Sensor 2 (Upstairs)",
    namespace: "climate_sensor_2",
    constraints: {
      temperature: {
        min: 20,
        max: 26,
      },
      humidity: {
        min: 50,
        max: 70,
      },
    },
  },
  {
    label: "Sensor 3 (Outside)",
    namespace: "climate_sensor_3",
    constraints: {
      temperature: {
        min: 20,
        max: 25,
      },
      humidity: {
        min: 40,
        max: 70,
      },
    },
  },
  {
    label: "Sensor 4 (Living room)",
    namespace: "esp32_001",
    constraints: {
      temperature: {
        min: 20,
        max: 25,
      },
      humidity: {
        min: 50,
        max: 70,
      },
    },
  },
];

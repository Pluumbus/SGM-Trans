export interface VehicleTreeObject {
  id: number;
  parentGroupId: number | null;
  name: string;
  objects: Array<{
    uuid: string;
    name: string;
    terminal_type: string;
    receive_data: number;
    terminal_id: number;
  }>;
  autocheck_id: number;
  children: VehicleTreeObject[];
}

export interface TrackReport {
  track: Array<{
    date: number; // UNIX timestamp
    direction: number; // направление???
    latitude: number; // Latitude in decimal degrees
    longitude: number; // Longitude in decimal degrees
    speed: number; // Speed in km/h
    satellitesCount: number; // кол-во спутников по которым считали геопоз
  }>;
}

export interface VehicleStatus {
  status: boolean;
  address: string; // Address or location of the vehicle
  currentFuel: number; // Current fuel level
  currentIgn: boolean; // Indicates if the ignition is on
  currentSpeed: number; // Current speed of the vehicle
  lastDataDate: number; // UNIX timestamp (UTC seconds) of the last recorded data
  lastGPS: {
    latitude: number; // Latitude of the last recorded GPS position
    longitude: number; // Longitude of the last recorded GPS position
  };
  lastGPSDir: number; // Direction of the last GPS position (in degrees, 0-360)
  speedExceed: boolean; // Indicates if the speed exceeds a defined threshold
}

export interface VehicleObject {
  terminal: {
    terminalId: number;
    uuid: string;
    manufactureId: string;
    terminalType: string;
    registratorType: string;
  };
  vehicle: {
    thingName: string;
    garageNumber: string;
    function: string;
    brand: string;
    model: string;
    color: string;
    manufactureYear: number;
    vin: string;
    engineNumber: string;
    chassisNumber: string;
    licencePlate: string;
    engineManufacturer: string;
    engineModel: string;
    enginePower: string;
    vehicleRegistrationCertificate: string;
    vehiclePassport: string;
    leaseAgreementNumber: string;
    categories: string;
    comment: string;
  };
  movement: {
    speedSource: number;
    excludePointWithIgnitionOff: boolean;
    mileageCoef: number;
    accelerationCoef: number;
    maximalAcceleration: number;
    traceStanding: boolean;
    standingDuration: number;
    traceStopping: boolean;
    stoppingDuration: number;
    applyIgnition: boolean;
    traceEngineSpeed: boolean;
    traceEngineSpeedThreshold: number;
    traceAdditionalEquipment: boolean;
    traceAdditionalEquipmentEventTypeId: number;
    noValidDataDuration: number;
    mileageDrift: number;
    distanceDrift: number;
  };
  engine: {
    rpmCoef: number;
    rpmIdling: number;
    rpmCritical: number;
  };
  mainTank: {
    tankType: string;
    checkFuelQualityLls5: boolean;
    autoTuningCoefThreshold: number;
    fillThreshold: number;
    drainThreshold: number;
    mileageConsumption: number;
    motorHourConsumption: number;
    dutyConsumption: number;
    seasonFuelCoef: number;
    fuelType: number;
    roughFilterLength: number;
    approximationBufferLength: number;
    fuelAlgorithmType: number;
    refuelBreakRangeTime: number;
    drainBreakRangeTime: number;
    quartileBreakRangeTime: number;
    fuelOpStartDeviationTime: number;
    fuelOpEndDeviationTime: number;
    movementDeviationTime: number;
    fuelEventSpeedThreshold: number;
    massCalcMethod: number;
    standartFuelDensity: number;
    fuelTempDataSource: number;
    fuelDensityTempCoef: number;
    fuelDensityDataSource: number;
  };
  deliverySensors: {
    deliverySensorNmb: number;
    tankNmbs: number;
    sourceType: number;
    deliveryThreshold: number;
    deliveryCoef: number;
    breakRangeTime: number;
    allowableRefuelingInterval: number;
  };
  additionalTank: {
    tankType: string;
    fillThreshold: number;
    drainThreshold: number;
    dutyConsumption: number;
    roughFilterLength: number;
    approximationBufferLength: number;
  };
  univInputs: Array<{
    univInputNumber: number;
    univInputType: number;
    univEquipmentType: number;
    univInputDevice: string;
    univInputCoef: number;
    univInputMinCheck: boolean;
    univInputMin: number;
    univInputMaxCheck: boolean;
    univInputMax: number;
    univInputMinVoltage: number;
    univInputMaxVoltage: number;
    inverse: boolean;
  }>;
  calibrationTables: Array<{
    sensorNmb: number;
    tankNmb: number;
    records: Array<{
      code: number;
      liters: number;
    }>;
  }>;
  safeDriving: {
    maximalSpeed: number;
    limitSpeed: number;
    speedSensitivity: number;
    allowableSpeedInTurning: number;
    limitSpeedInTurning: number;
    minVerticalAccelerationDuration: number;
    maxIdleRpmDuration: number;
    minEngineTemp: number;
    maxEngineTemp: number;
    maxNoGreenZoneDuration: number;
    rpmGreenZoneLow: number;
    rpmGreenZoneHigh: number;
  };
  reader: {
    startRegByKey: boolean;
    stopRegByIgnition: boolean;
    stopRegByKeyRemoving: boolean;
    regRestoringPeriod: number;
  };
  iqFreeze: {
    useIqFreeze: boolean;
    iqFreezeTimeNoData: number;
    iqFreezeTempThresholdUp: number;
    iqFreezeTempThresholdDown: number;
  };
}

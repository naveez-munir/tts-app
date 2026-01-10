import { ServiceType } from '@/lib/types/enums';

export function getFlippedServiceType(serviceType: ServiceType): ServiceType {
  switch (serviceType) {
    case ServiceType.AIRPORT_DROPOFF:
      return ServiceType.AIRPORT_PICKUP;
    case ServiceType.AIRPORT_PICKUP:
      return ServiceType.AIRPORT_DROPOFF;
    case ServiceType.POINT_TO_POINT:
    default:
      return ServiceType.POINT_TO_POINT;
  }
}


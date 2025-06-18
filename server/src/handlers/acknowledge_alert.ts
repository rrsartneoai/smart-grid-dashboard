
import { type Alert } from '../schema';

export declare function acknowledgeAlert(alertId: number, userId: number): Promise<Alert>;

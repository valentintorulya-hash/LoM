import * as DecimalFormat from 'break_infinity.js';

const Decimal = (DecimalFormat.default || DecimalFormat);

export default Decimal;
export { Decimal };

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Decimal = any;
/* eslint-enable @typescript-eslint/no-explicit-any */
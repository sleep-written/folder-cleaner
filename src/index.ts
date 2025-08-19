import { ProgramParams } from '@utils/program-params/index.js';
import { Display } from '@utils/display/index.js';

const params = new ProgramParams();
const display = new Display(params);
display.showCurrentValues();
import Upu from './Upu';
import Air from './Air';
import {Form} from './Air/Airport';
import Manager from './Manager';
import Amd from './Amd';

const Components = {
    Upu : Upu,
    Airport : Air.Airport,
    AirportEdit : Form,
    Airline : Air.Airline,
    Manager : Manager,
    Fwb : Air.Fwb,
    Amd
};

export default Components;
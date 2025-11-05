import store1 from '../assets/store-01.webp';
import store2 from '../assets/store-02.webp';

const branches = {
  branch1: {
    id: 'branch1',
    name: 'Sucursal 1 - Centro',
    address: 'Vera Mujica 1222',
    hours: 'Lunes a Viernes: 9:00 - 18:00; Sábado: 10:00 - 13:00',
    phone: '+54 2321 24343',
    displayPhone: '232124343',
    email: 'KBR@sucursal1.com',
    map: 'https://maps.app.goo.gl/YSeq39955dMcH67w7',
    image: store1,
    notes: 'Retiro en 24-48 horas hábiles',
  },
  branch2: {
    id: 'branch2',
    name: 'Sucursal 2 - Norte',
    address: 'Zeballos 1341, S2000 Rosario, Santa Fe',
    hours: 'Lunes a Viernes: 9:00 - 18:00; Sábado: 10:00 - 13:00',
    phone: '+54 2312 19974',
    displayPhone: '231219974',
    email: 'KBR@sucursal2.com',
    map: 'https://maps.app.goo.gl/eZ4d3PLBQXq5dZFe9',
    image: store2,
    notes: 'Retiro inmediato si el stock está disponible',
  },
};

export default branches;

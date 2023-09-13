import { EntityRepository, Repository } from 'typeorm';

import {Usuario} from '../entities/Usuario';

@EntityRepository(Usuario)
class UserRepository extends Repository<Usuario> {}

export default Usuario;

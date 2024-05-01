import { Controller } from '@nestjs/common';
import { CasosService } from './casos.service';

@Controller('/api/v1/casos')
export class CasosController {
  constructor(private readonly casosService: CasosService) {}
}

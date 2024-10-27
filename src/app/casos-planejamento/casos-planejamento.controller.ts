import { Protegido } from '@/auth/decorators/protegido.decorator';
import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CasosPlanejamentoService } from './casos-planejamento.service';

@Protegido()
@ApiBearerAuth()
@ApiTags('Notificacoes')
@Controller('/api/v1')
export class CasosPlanejamentoController {

  constructor(
    private readonly casosPlanejamentoService: CasosPlanejamentoService,
  ) { }

}

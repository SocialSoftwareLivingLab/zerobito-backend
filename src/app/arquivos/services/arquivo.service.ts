import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ArquivoEntity } from '../entities/arquivo.entity';
import { StorageService } from '../interfaces/storage.interface';
import { ArquivoVinculoEntity } from '../entities/arquivo.vinculo.entity';
import { STORAGE_SERVICE } from '../interfaces/storafe.constant';

@Injectable()
export class ArquivoService {
  constructor(
    @InjectRepository(ArquivoEntity)
    private readonly arquivoRepository: Repository<ArquivoEntity>,

    @Inject(STORAGE_SERVICE)
    private readonly storageService: StorageService,
  ) {}

  /* =========================================
      UPLOAD
  ========================================= */

  async upload(
    file: Express.Multer.File,
    namespace: string,
  ): Promise<ArquivoEntity> {
    if (!file) {
      throw new BadRequestException('Arquivo não enviado');
    }

    // file.buffer carrega o arquivo inteiro em memória antes de enviar ao storage.
    // Para nuvem com arquivos grandes, considere habilitar streaming no multer
    // (remova o FileInterceptor padrão e use um interceptor com storage: multer.memoryStorage
    // de menor limite, ou substitua por stream via file.stream + PassThrough).
    const { key } = await this.storageService.upload(
      file.buffer,
      file.originalname,
    );

    const arquivo = this.arquivoRepository.create({
      filename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      storageId: key,
      namespace,
    });

    return this.arquivoRepository.save(arquivo);
  }

  /* =========================================
      DOWNLOAD
  ========================================= */

  async download(id: string) {
    const arquivo = await this.arquivoRepository.findOne({
      where: { id },
    });

    if (!arquivo) {
      throw new NotFoundException('Arquivo não encontrado');
    }

    // Para nuvem com arquivos grandes, avalie se a implementação de StorageService
    // deve retornar uma pre-signed URL em vez de um Buffer. Nesse caso, este método
    // retornaria a URL e o controller redirecionaria o cliente diretamente ao bucket,
    // eliminando o tráfego de bytes pelo servidor (veja comentário no controller).
    const buffer = await this.storageService.download(
      arquivo.storageId,
    );

    return {
      buffer,
      mimeType: arquivo.mimeType,
      filename: arquivo.filename,
    };
  }

  /* =========================================
      DELETE FÍSICO + BANCO
  ========================================= */

  async delete(id: string) {
    const arquivo = await this.arquivoRepository.findOne({
      where: { id },
    });

    if (!arquivo) {
      throw new NotFoundException('Arquivo não encontrado');
    }

    await this.storageService.delete(arquivo.storageId);

    return this.arquivoRepository.remove(arquivo);
  }

  /* =========================================
      BUSCAR METADADO
  ========================================= */

  async findById(id: string): Promise<ArquivoEntity> {
    const arquivo = await this.arquivoRepository.findOne({
      where: { id },
    });

    if (!arquivo) {
      throw new NotFoundException('Arquivo não encontrado');
    }

    return arquivo;
  }
}

@Injectable()
export class ArquivoVinculoService {
  constructor(
    @InjectRepository(ArquivoVinculoEntity)
    private readonly vinculoRepository: Repository<ArquivoVinculoEntity>,

    @InjectRepository(ArquivoEntity)
    private readonly arquivoRepository: Repository<ArquivoEntity>,
  ) {}

  /* =========================================
      CRIAR VÍNCULO
  ========================================= */

  async vincular(
    arquivoId: string,
    entityType: string,
    entityId: string,
  ) {
    const arquivo = await this.arquivoRepository.findOne({
      where: { id: arquivoId },
    });

    if (!arquivo) {
      throw new NotFoundException('Arquivo não encontrado');
    }

    const vinculo = this.vinculoRepository.create({
      entityType,
      entityId,
      arquivo,
    });

    return this.vinculoRepository.save(vinculo);
  }

  /* =========================================
      DESVINCULAR
  ========================================= */

  async desvincular(
    arquivoId: string,
    entityType: string,
    entityId: string,
  ) {
    const vinculo = await this.vinculoRepository.findOne({
      where: {
        entityType,
        entityId,
        arquivo: { id: arquivoId },
      },
      relations: ['arquivo'],
    });

    if (!vinculo) {
      throw new NotFoundException('Vínculo não encontrado');
    }

    return this.vinculoRepository.remove(vinculo);
  }

  /* =========================================
      LISTAR POR ENTIDADE
  ========================================= */

  async listarPorEntidade(
    entityType: string,
    entityId: string,
  ) {
    const vinculos = await this.vinculoRepository.find({
      where: { entityType, entityId },
      relations: ['arquivo'],
    });

    return vinculos.map(v => v.arquivo);
  }

  /* =========================================
      VERIFICAR SE PERTENCE
  ========================================= */

  async pertenceAEntidade(
    arquivoId: string,
    entityType: string,
    entityId: string,
  ): Promise<boolean> {
    const count = await this.vinculoRepository.count({
      where: {
        entityType,
        entityId,
        arquivo: { id: arquivoId },
      },
    });

    return count > 0;
  }

  /* =========================================
      CONTAR VÍNCULOS DO ARQUIVO
  ========================================= */

  async contarVinculos(arquivoId: string): Promise<number> {
    return this.vinculoRepository.count({
      where: {
        arquivo: { id: arquivoId },
      },
    });
  }
}
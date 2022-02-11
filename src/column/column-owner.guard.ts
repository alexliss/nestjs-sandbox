import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { ColumnEntity } from './column.entity';

@Injectable()
export class ColumnOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(ColumnEntity)
    private readonly columnRepository: Repository<ColumnEntity>
    ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const columnId = request.params.id;

    const column = await this.columnRepository.findOneOrFail(columnId);
    
    if (request.user.userId != column.userId) {
      throw new UnauthorizedException();
    }

    return true;
  }
}

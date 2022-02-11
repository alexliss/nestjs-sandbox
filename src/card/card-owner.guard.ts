import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardEntity } from './card.entity';

@Injectable()
export class CardOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>
    ) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const cardId = request.params.id;

    const card = await this.cardRepository.findOneOrFail(cardId);
    
    if (request.user.userId != card.userId) {
      throw new UnauthorizedException();
    }

    return true;
  }
}

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';

@Injectable()
export class CommentOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>
    ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const commentId = request.params.id;

    const comment = await this.commentRepository.findOneOrFail(commentId);
    
    if (request.user.userId != comment.userId) {
      throw new UnauthorizedException();
    }

    return true;
  }
}

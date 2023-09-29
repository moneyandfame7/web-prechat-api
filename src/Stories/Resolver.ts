import { Resolver } from '@nestjs/graphql'

@Resolver()
export class StoriesResolver {
  public async getAllStories() {}

  public async getUserStories() {}

  public async viewStory() {}

  public async deleteStory() {}

  public async reactStory() {}
}

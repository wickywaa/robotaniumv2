import { useQuery } from '@tanstack/react-query';
import { IBot } from '../models/Bots';
import { BotService } from '../services/botServices';

export function useBotMutations() {

  const botService = new BotService();
 
  const botsQuery = useQuery<IBot[], Error>({queryKey:['bots'], queryFn: () => botService.fetchBots()});
  
  return { botsQuery };
}



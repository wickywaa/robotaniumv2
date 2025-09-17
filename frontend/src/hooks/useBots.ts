import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../context/ToastContext';
import { IBot, ICreateBotDTo } from '../models/Bots';
import { BotService } from '../services/botServices';

export function useBotMutations() {

  const botService = new BotService();
  const queryClient = useQueryClient();
  const { showToastMessage } = useToast();
 
  const botsQuery = useQuery<IBot[], Error>({queryKey:['bots'], queryFn: () => botService.fetchBots()});

  const createBotMutation = useMutation<void,Error,ICreateBotDTo>({
    mutationFn:(bot: ICreateBotDTo)=> botService.createBot(bot),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bots'] });
    },
    onError: () => {
      console.log('error fetching bots');
    }
  })

  const deleteBotMutation = useMutation<void, Error, string>({
    mutationFn: (botId: string) => botService.deleteBots(botId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['bots']})
      console.log('updated delete bot')
      showToastMessage({
        message: `bot  successfully deleted`,
        severity: 'success'
      })
    },
    onError: ()=> {
      showToastMessage({
        message: `bot  could not be  deleted`,
        severity: 'error'
      })
    }
  })

  const editBotMutation = useMutation<void, Error, {botId:string; bot:ICreateBotDTo}> ({
    mutationFn: ({botId,bot}: {botId:string, bot:ICreateBotDTo}) => botService.updatebots(botId, bot),
    onSuccess: ()=> {
      queryClient.invalidateQueries({queryKey:['bots']});
    },
    onError:(error:Error)=>{
      console.log(error)
    }
  })
  
  return { botsQuery, createBotMutation, deleteBotMutation, editBotMutation };
}



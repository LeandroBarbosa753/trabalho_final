import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { TimeIntervalTriggerInput } from 'expo-notifications';

// Configurar como as notificações devem ser tratadas quando recebidas
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const notificationService = {
  // Solicitar permissões para notificações
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Permissão para notificações negada');
        return false;
      }

      // Para Android, configurar canal de notificação
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return true;
    } catch (error) {
      console.error('Erro ao solicitar permissões de notificação:', error);
      return false;
    }
  },

  // Enviar notificação local imediata
  async sendLocalNotification(title: string, body: string, data?: any): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: true,
        },
        trigger: null, // Enviar imediatamente
      });
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  },

  // Agendar notificação para o futuro
  async scheduleNotification(
    title: string, 
    body: string, 
    seconds: number, 
    data?: any
  ): Promise<string | null> {
    try {
      const trigger: TimeIntervalTriggerInput = {
        type: 'timeInterval',
        timeInterval: seconds,
        repeats: false,
      };
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: true,
        },
        trigger,
      });
      return notificationId;
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
      return null;
    }
  },

  // Cancelar notificação agendada
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Erro ao cancelar notificação:', error);
    }
  },

  // Cancelar todas as notificações agendadas
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Erro ao cancelar todas as notificações:', error);
    }
  },

  // Notificações específicas do app
  async notifyRecipeCreated(recipeName: string): Promise<void> {
    await this.sendLocalNotification(
      '🍳 Receita Criada!',
      `Sua receita "${recipeName}" foi salva com sucesso!`,
      { type: 'recipe_created', recipeName }
    );
  },

  async notifyRecipeUpdated(recipeName: string): Promise<void> {
    await this.sendLocalNotification(
      '✏️ Receita Atualizada!',
      `Sua receita "${recipeName}" foi atualizada!`,
      { type: 'recipe_updated', recipeName }
    );
  },

  async notifyRecipeFavorited(recipeName: string): Promise<void> {
    await this.sendLocalNotification(
      '❤️ Receita Favoritada!',
      `Você favoritou a receita "${recipeName}"!`,
      { type: 'recipe_favorited', recipeName }
    );
  },

  async notifyWelcome(userName: string): Promise<void> {
    await this.sendLocalNotification(
      '👋 Bem-vindo!',
      `Olá ${userName}! Que tal criar sua primeira receita?`,
      { type: 'welcome', userName }
    );
  },

  async notifyProfileUpdated(): Promise<void> {
    await this.sendLocalNotification(
      '👤 Perfil Atualizado!',
      'Suas informações de perfil foram atualizadas com sucesso!',
      { type: 'profile_updated' }
    );
  },

  // Agendar lembrete para cozinhar
  async scheduleRecipeReminder(recipeName: string, minutes: number): Promise<string | null> {
    return await this.scheduleNotification(
      '🍽️ Hora de Cozinhar!',
      `Que tal preparar "${recipeName}" hoje?`,
      minutes * 60,
      { type: 'recipe_reminder', recipeName }
    );
  },
};

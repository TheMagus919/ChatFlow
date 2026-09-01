import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ConversationService } from '../../services/conversation.service';
import { MessageService } from '../../services/message.service';
import { ChatService } from '../../services/chat.service';
import { TagService } from '../../services/tag.service';
import { CustomerService } from '../../services/customer.service';

import { ChangeDetectorRef } from '@angular/core';
import { Conversation } from '../../interfaces/conversation.interface';
import { Message } from '../../interfaces/message.interface';
import { Customer } from '../../interfaces/customer.interface';
import { SendMessageDto } from '../../interfaces/send-message.interface';
import { CustomerTag } from '../../interfaces/customerTag.interface';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
@Component({
  selector: 'app-conversations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationsComponent
implements OnInit, OnDestroy {

  conversations: Conversation[] = [];

  messages: Message[] = [];

  selectedConversation: Conversation | null = null;

  newMessage = '';

  loadingMessages = false;

  connected = false;

  showMenu = false;

  showTagsModal = false;

  customerTags: number[] = [];

  availableTags: any[] = [];

  currentStatus = 'in_conversation';

  showArchived = false;

  searchTerm = '';

  notifications: any[] = [];

  unreadCount = 0;

  @ViewChild('messagesContainer')
  messagesContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private conversationService: ConversationService,
    private messageService: MessageService,
    private chatService: ChatService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private tagService: TagService,
    private customerService: CustomerService,
    private authService: AuthService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {

    this.chatService.connect();

    this.connected = true;

    this.listenSocketMessages();
    this.listenNotifications(); 
    this.loadTags();
    this.route.paramMap.subscribe(params => {

      const customerId = Number(
        params.get('customerId')
      );

      this.loadConversations(customerId);

    });

  }

  ngOnDestroy(): void {

    this.chatService.disconnect();

  }

  private listenNotifications(): void {

  this.chatService.onNotification(
    (notification: any) => {

      console.log(
        '🔔 Nueva notificación',
        notification
      );

      this.notifications.unshift(
        notification
      );

      this.unreadCount++;

      this.cdr.detectChanges();

    }
  );

}
loadConversations(customerId?: number): void {

  this.conversationService.getConversations()
    .subscribe({
      next: (conversations) => {

        this.conversations = conversations.sort((a, b) => {

          const aTime = a.last_message_at
            ? new Date(a.last_message_at).getTime()
            : 0;

          const bTime = b.last_message_at
            ? new Date(b.last_message_at).getTime()
            : 0;

          return bTime - aTime;

        });
        if (customerId) {
          const existing = this.conversations.find(
            c => Number(c.customerId) === Number(customerId)
          );

          if (existing) {
            this.selectConversation(existing);
            return;
          }

          this.createConversation(customerId);
          return;
        }

        const conversation = this.filteredConversations;

        if (conversation.length > 0) {

          this.selectConversation(
            conversation[0]
          );

        }

      }
    });

}

createConversation(customerId: number): void {

  this.conversationService
    .createConversation(customerId)
    .subscribe({

      next: (conversation) => {

        this.conversations.unshift(
          conversation
        );

        this.selectConversation(
          conversation
        );

      },

      error: (err) => {
        console.error(err);
      }

    });

}
  selectConversation(
    conversation: Conversation
  ): void {

    if (
      this.selectedConversation?.id ===
      conversation.id
    ) return;

    // salir anterior
    if (this.selectedConversation) {

      this.chatService.leaveConversation(
        this.selectedConversation.id
      );

    }
    this.selectedConversation = conversation;

    this.messages = [];

    this.chatService.joinConversation(
      conversation.id
    );
    console.log('Joined conversation:', conversation.id);
    this.loadMessages(conversation.id);
    this.loadCustomerTags();

  }

  loadMessages(
  conversationId: number
): void {

  this.loadingMessages = true;

  this.messageService
    .getMessages(conversationId)
    .subscribe({

      next: (messages: any[]) => {

        console.log(
          'BACKEND MESSAGES:',
          messages
        );

        this.messages = [...messages.map(
          (message: any) => ({

            id: message.id,

            content: message.content,

            direction: message.direction,

            status: message.status,

            customerId:
              message.customer_id,

            conversationId:
              message.conversation_id,

            created_at:
              new Date(message.created_at),

            delivered_at:
              message.delivered_at
                ? new Date(message.delivered_at)
                : null,

            read_at:
              message.read_at
                ? new Date(message.read_at)
                : null

          }))
        ];
        this.cdr.detectChanges();
        console.log(
          'PARSED:',
          this.messages
        );

        this.loadingMessages = false;

        this.scrollToBottom();

      },

      error: (err) => {

        console.error(err);

        this.loadingMessages = false;

      }

    });

}

  sendMessage(): void {

    if (!this.newMessage.trim()) return;

    if (!this.selectedConversation) return;

    const payload: SendMessageDto = {

      content: this.newMessage,

      customerId:
        this.selectedConversation.customerId,

      conversationId:
        this.selectedConversation.id,

      userId:
        this.selectedConversation.user_id

    };
    // GUARDAR EN DB
    this.messageService
      .sendMessage(payload)
      .subscribe({

        next: (savedMessage) => {
          
          const parsedMessage: Message = {

            id: savedMessage.id,

            content: savedMessage.content,

            direction: 'outgoing',

            status: savedMessage.status,

            customerId:
              savedMessage.customerId ||
              savedMessage.customer_id,

            conversationId:
              savedMessage.conversationId ||
              savedMessage.conversation_id,

            created_at:
              savedMessage.created_at
              ? new Date(savedMessage.created_at)
              : new Date()

          };
          
          // 1. Añadir mensaje al chat
          this.messages = [
            ...this.messages,
            parsedMessage
          ];

          // 2. ¡AQUÍ ESTÁ LA CLAVE! Actualizar la lista del sidebar inmediatamente
          const conversationIndex = this.conversations.findIndex(
            c => c.id === this.selectedConversation!.id
          );
          
          if (conversationIndex !== -1) {
            // Obtenemos la referencia de la conversación
            const conversation = this.conversations[conversationIndex];
            
            // Actualizamos sus datos
            conversation.last_message = this.newMessage;
            conversation.last_message_at = new Date(); // Usamos la fecha actual

            // La quitamos de donde está
            this.conversations.splice(conversationIndex, 1);

            // La ponemos al principio (ya que es la más reciente)
            this.conversations.unshift(conversation);
          }
          
          this.cdr.detectChanges();
          
          // Emitir socket
          this.chatService.sendMessage(payload);

          setTimeout(() => {
            this.newMessage = '';
          });

          this.scrollToBottom();

        },

        error: (err) => {
          console.error(err);
        }

      });

  }
/*
  listenSocketMessages(): void {

    this.chatService.onNewMessage(

      (message: Message) => {

        if (
          this.selectedConversation &&
          message.conversationId ===
          this.selectedConversation.id
        ) {

          const exists =
            this.messages.some(
              m => m.id === message.id
            );

          if (!exists) {

            this.messages = [
              ...this.messages,
              {
                ...message,

                customerId:
                  (message as any).customerId ||
                  (message as any).customer_id,

                conversationId:
                  (message as any).conversationId ||
                  (message as any).conversation_id,

                created_at:
                  message.created_at
                  ? new Date(message.created_at)
                  : new Date()
              }
            ];
            this.cdr.detectChanges();
            this.scrollToBottom();

          }

        }

      }

    );

  }
*/
  listenSocketMessages(): void {
    this.chatService.onNewMessage(

      (message: Message) => {

        const exists = this.messages.some(
          m => m.id === message.id
        );

        if (!exists) {

          if (
            this.selectedConversation &&
            message.conversationId ===
            this.selectedConversation.id
          ) {

            this.messages = [
              ...this.messages,
              {
                ...message,
                created_at:
                  message.created_at
                  ? new Date(message.created_at)
                  : new Date()
              }
            ];

            this.scrollToBottom();

          }

          const conversation =
            this.conversations.find(
              c =>
                c.id ===
                message.conversationId
            );

          if (conversation) {

            conversation.last_message =
              message.content;

            conversation.last_message_at =
              new Date();

            this.conversations =
              [
                conversation,
                ...this.conversations.filter(
                  c =>
                    c.id !==
                    conversation.id
                )
              ];

          }

          this.cdr.detectChanges();

        }

      }

    );

  }
  scrollToBottom(): void {

  setTimeout(() => {

    console.log(
      'Container:',
      this.messagesContainer
    );

    if (!this.messagesContainer) {
      return;
    }

    const element =
      this.messagesContainer.nativeElement;

    console.log(
      'scrollHeight:',
      element.scrollHeight
    );

    element.scrollTop =
      element.scrollHeight;

  }, 100);

}

  trackByConversation(
    index: number,
    item: Conversation
  ): number {

    return item.id;

  }

  trackByMessage(
  index: number,
  item: Message
): number {

  return item.id;

}
//TAGS
loadTags(): void {

  this.tagService.getAll()
    .subscribe({
      next: (res: any) => {

        console.log('RAW TAG RESPONSE:', res);

        this.availableTags = (res.data ?? res ?? []).map((t: any) => ({
          ...t,
          id: Number(t.id)
        }));

        console.log('Available tags parsed:', this.availableTags);
      },

      error: (err) => {
        console.error('Error loading tags:', err);
        this.availableTags = [];
      }
    });
}

changeStatus(
  status: Customer['status']
): void {

  if (!this.selectedConversation) return;

  this.customerService.updateStatus(

    this.selectedConversation.customerId,

    status

  ).subscribe({

    next: (customer) => {

      this.selectedConversation!.customer.status =
        customer.status;

      this.showMenu = false;

      this.cdr.detectChanges();

    },

    error: err => {

      console.error(err);

    }

  });

}

openTagsModal(): void {

  if (!this.selectedConversation) return;

  this.showMenu = false;
  this.showTagsModal = true;

  this.tagService.getAll().subscribe({
    next: (res: any) => {

      this.availableTags = (res.data ?? res ?? []).map((t: any) => ({
        ...t,
        id: Number(t.id)
      }));

      this.customerService
        .getCustomerTags(this.selectedConversation!.customerId)
        .subscribe({

          next: (tags: any[]) => {

            this.customerTags = tags.map(
              (t: any) => Number(t.id)
            );

            this.cdr.detectChanges();

          },

          error: err => {
            console.error(err);
          }

        });

    },

    error: err => {
      console.error(err);
    }

  });

}

toggleTag(tagId: number): void {

  const id = Number(tagId);
  const exists =
    this.customerTags.includes(id);

  if (exists) {

    this.customerTags =
      this.customerTags.filter(
        t => t !== id
      );

  } else {

    this.customerTags = [
      ...this.customerTags,
      id
    ];

  }

  this.saveTags();

}

saveTags(): void {

  if (!this.selectedConversation) return;

  this.customerService.updateTags(

    this.selectedConversation.customerId,

    this.customerTags.map(String)

  ).subscribe({

    next: () => {

      this.loadCustomerTags();

    },

    error: err => {

      console.error(err);

    }

  });

}

loadCustomerTags(): void {

  if (!this.selectedConversation) return;

  this.customerService
    .getCustomerTags(
      this.selectedConversation.customerId
    )
    .subscribe({

      next: (tags: any[]) => {

        const formatted = tags.map(
          (t: any) => ({
            id: t.id,
            customerId:
              this.selectedConversation!.customerId,
            tagId: Number(t.id),
            tag: {
              name: t.name,
              color: t.color
            }
          })
        );

        this.selectedConversation!.customer.customerTags =
          formatted;

        this.customerTags =
          formatted.map(
            t => t.tagId
          );

        this.cdr.detectChanges();

      },

      error: err => {

        console.error(err);

      }

    });

}

getStatusLabel(status: string): string {

  switch (status) {

    case 'new':
      return 'Nuevo';

    case 'in_conversation':
      return 'En conversación';

    case 'won':
      return 'Vendido';

    case 'lost':
      return 'Perdido';

    case 'closed':
      return 'Cerrado';

    default:
      return status;

  }

}

private isArchived(conversation: Conversation): boolean {

  return (
    conversation.customer.status === 'won' ||
    conversation.customer.status === 'lost' ||
    conversation.customer.status === 'closed'
  );

}

toggleArchived(): void {

  this.showArchived = !this.showArchived;

  const conversations = this.filteredConversations;

  if (conversations.length > 0) {

    this.selectConversation(
      conversations[0]
    );

  } else {

    this.selectedConversation = null;
    this.messages = [];

  }

}

//filtrado de informacion
get filteredConversations(): Conversation[] {

  return this.conversations.filter(c => {

    const search =
      this.searchTerm.toLowerCase();

    const matchesSearch =
      c.customer.name
        .toLowerCase()
        .includes(search)
      ||
      c.customer.phone
        ?.toLowerCase()
        .includes(search);

    const archived =
      c.customer.status === 'closed' ||
      c.customer.status === 'lost' ||
      c.customer.status === 'won';

    return this.showArchived
      ? archived && matchesSearch
      : !archived && matchesSearch;

  });

}

  showLogoutModal = false;

  openLogoutModal(): void {
    this.showLogoutModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeLogoutModal(): void {
    this.showLogoutModal = false;
    document.body.style.overflow = 'auto';
  }

  confirmLogout(): void {
    document.body.style.overflow = 'auto';
    this.closeLogoutModal();

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);

  }

  //FECHAS Y TILDES DE VISTO
  isSameDay(date1: Date, date2: Date): boolean {

  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );

}

shouldShowDateSeparator(index: number): boolean {

  if (index === 0) return true;

  const current =
    new Date(this.messages[index].created_at);

  const previous =
    new Date(this.messages[index - 1].created_at);

  return !this.isSameDay(
    current,
    previous
  );

}

getDateLabel(date: Date): string {

  const today = new Date();

  const yesterday = new Date();

  yesterday.setDate(
    yesterday.getDate() - 1
  );

  if (this.isSameDay(date, today)) {
    return 'Hoy';
  }

  if (this.isSameDay(date, yesterday)) {
    return 'Ayer';
  }

  return date.toLocaleDateString(
    'es-AR',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }
  );

}

getMessageStatus(message: Message): string {

  if (
    message.read_at
    ||
    message.status === 'read'
  ) {
    return 'read';
  }

  if (
    message.delivered_at
    ||
    message.status === 'delivered'
  ) {
    return 'delivered';
  }

  return 'sent';

}
}
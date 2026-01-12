# Angular

Integrate Supprt with Angular applications.

## Installation

```bash
npm install @supprt/widget
```

## Basic Usage

```typescript
// app.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core'
import { init, destroy } from '@supprt/widget'

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit, OnDestroy {
  ngOnInit() {
    init({
      publicKey: 'pk_xxx'
    })
  }

  ngOnDestroy() {
    destroy()
  }
}
```

## Service

Create a service for better encapsulation:

```typescript
// services/supprt.service.ts
import { Injectable, OnDestroy } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { init, destroy, on, off, isInitialized } from '@supprt/widget'
import type { SupprtConfig, Message } from '@supprt/widget'

@Injectable({
  providedIn: 'root'
})
export class SupprtService implements OnDestroy {
  private ready$ = new BehaviorSubject<boolean>(false)
  private messages$ = new BehaviorSubject<Message[]>([])

  readonly isReady = this.ready$.asObservable()
  readonly messages = this.messages$.asObservable()

  init(config: SupprtConfig): void {
    init(config)

    on('ready', () => {
      this.ready$.next(true)
    })

    on('message:received', (message: Message) => {
      this.messages$.next([...this.messages$.value, message])
    })
  }

  ngOnDestroy(): void {
    destroy()
  }
}
```

Usage:

```typescript
// app.component.ts
import { Component, OnInit } from '@angular/core'
import { SupprtService } from './services/supprt.service'

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="supprtService.isReady | async">
      Widget ready!
    </div>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  constructor(public supprtService: SupprtService) {}

  ngOnInit() {
    this.supprtService.init({
      publicKey: 'pk_xxx'
    })
  }
}
```

## With Authentication

```typescript
// app.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { AuthService } from './services/auth.service'
import { init, destroy } from '@supprt/widget'

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit, OnDestroy {
  private authSub?: Subscription

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authSub = this.authService.user$.subscribe(user => {
      destroy()

      const config: any = {
        publicKey: 'pk_xxx'
      }

      if (user) {
        config.user = {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }

      init(config)
    })
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe()
    destroy()
  }
}
```

## Programmatic Control

```typescript
// help-button.component.ts
import { Component } from '@angular/core'
import { open, close, toggle } from '@supprt/widget'

@Component({
  selector: 'app-help-button',
  template: `
    <button (click)="toggleChat()">
      Need help?
    </button>
  `
})
export class HelpButtonComponent {
  toggleChat() {
    toggle()
  }
}
```

## Event Handling

```typescript
// app.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core'
import { init, destroy, on, off } from '@supprt/widget'
import type { Message } from '@supprt/widget'

@Component({
  selector: 'app-root',
  template: `
    <span *ngIf="unreadCount > 0" class="badge">
      {{ unreadCount }}
    </span>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit, OnDestroy {
  unreadCount = 0

  private handleMessage = (message: Message) => {
    this.unreadCount++
  }

  ngOnInit() {
    init({ publicKey: 'pk_xxx' })
    on('message:received', this.handleMessage)
  }

  ngOnDestroy() {
    off('message:received', this.handleMessage)
    destroy()
  }
}
```

## Module

Create a module for encapsulation:

```typescript
// supprt.module.ts
import { NgModule, ModuleWithProviders } from '@angular/core'
import { SupprtService } from './services/supprt.service'

export interface SupprtModuleConfig {
  publicKey: string
}

@NgModule({})
export class SupprtModule {
  static forRoot(config: SupprtModuleConfig): ModuleWithProviders<SupprtModule> {
    return {
      ngModule: SupprtModule,
      providers: [
        SupprtService,
        { provide: 'SUPPRT_CONFIG', useValue: config }
      ]
    }
  }
}
```

Usage:

```typescript
// app.module.ts
import { NgModule } from '@angular/core'
import { SupprtModule } from './supprt.module'

@NgModule({
  imports: [
    SupprtModule.forRoot({
      publicKey: 'pk_xxx'
    })
  ]
})
export class AppModule {}
```

## Standalone Components

For Angular 14+ with standalone components:

```typescript
// app.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { init, destroy } from '@supprt/widget'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit, OnDestroy {
  ngOnInit() {
    init({
      publicKey: 'pk_xxx'
    })
  }

  ngOnDestroy() {
    destroy()
  }
}
```

## Best Practices

1. **Initialize in root component** or app initializer
2. **Clean up in `ngOnDestroy`** with `destroy()`
3. **Use services** for shared state and logic
4. **Store event handlers** as class properties for proper cleanup

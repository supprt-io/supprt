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
import { init, destroy, isInitialized } from '@supprt/widget'
import type { SupprtConfig } from '@supprt/widget'

@Injectable({
  providedIn: 'root'
})
export class SupprtService implements OnDestroy {
  init(config: SupprtConfig): void {
    init(config)
  }

  isInitialized(): boolean {
    return isInitialized()
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
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(private supprtService: SupprtService) {}

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

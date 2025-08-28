# Support Channels Documentation

## Overview
The support channels system provides a flexible and real-time availability management for customer support channels with time-based scheduling and plan-based restrictions.

## Architecture

### Components
- **SupportChannels.tsx**: Main component that renders support channels
- **channels-config.json**: Configuration file for channels data
- **support/page.tsx**: Main support page integrating the channels

## Features

### 1. Real-time Availability Checking
The system checks channel availability in real-time based on:
- Current UTC time
- Channel schedule configuration
- User plan level
- Service status

### 2. Schedule Types

#### Always Available
```json
{
  "availability": {
    "type": "always",
    "displayText": { "en": "24/7", "fr": "24h/7j" }
  }
}
```

#### Schedule-based
```json
{
  "availability": {
    "type": "schedule",
    "timezone": "UTC",
    "hours": {
      "monday": { "start": "09:00", "end": "22:00" },
      "tuesday": { "start": "09:00", "end": "22:00" }
    }
  }
}
```

#### Plan-based
```json
{
  "availability": {
    "type": "plan_based",
    "plans": {
      "business": {
        "type": "schedule",
        "hours": { ... }
      },
      "enterprise": {
        "type": "always"
      }
    }
  }
}
```

### 3. Status Indicators

Each channel displays:
- **Green dot + checkmark**: Available now
- **Red dot + X**: Currently unavailable
- **Yellow dot + lock**: Requires higher plan
- **Pulsing animation**: When channel is active

### 4. Dynamic Status Updates

- Updates every minute automatically
- Shows current UTC time
- Displays next available time when closed
- Shows reason for unavailability

## Configuration Guide

### Channel Structure

```json
{
  "id": "unique_id",
  "name": "Display Name",
  "icon": "icon_key",
  "description": {
    "en": "English description",
    "fr": "French description"
  },
  "features": [
    { "en": "Feature 1", "fr": "Fonctionnalité 1" }
  ],
  "availability": { ... },
  "responseTime": {
    "value": 2,
    "unit": { "en": "hours", "fr": "heures" }
  },
  "enabled": true,
  "requiresAuth": true,
  "minPlan": "starter|business|enterprise",
  "url": "/support/tickets"
}
```

### Adding New Channels

1. Edit `/apps/web/data/support/channels-config.json`
2. Add new channel object to the `channels` array
3. Ensure icon mapping exists in `SupportChannels.tsx`
4. Test availability logic

### Modifying Schedules

1. Locate channel in `channels-config.json`
2. Update `availability.hours` for each day
3. Times must be in 24h format (HH:MM)
4. All times are in UTC

## Testing

### Availability Testing
```javascript
// Test different times
const testTimes = [
  new Date('2024-01-15T10:00:00Z'), // Monday 10am UTC
  new Date('2024-01-15T23:00:00Z'), // Monday 11pm UTC
  new Date('2024-01-20T15:00:00Z')  // Saturday 3pm UTC
];
```

### Plan Testing
Change `userPlan` variable in component to test:
- 'starter'
- 'business'
- 'enterprise'

## Localization

All text supports English and French:
- Channel names and descriptions
- Feature lists
- Response time units
- Availability messages

## Performance Optimizations

1. **Lazy checking**: Availability only calculated when component renders
2. **Memoization**: Channel status cached until time changes
3. **Minimal re-renders**: Only updates when minute changes

## Future Enhancements

- [ ] Holiday calendar integration
- [ ] Custom timezone support per user
- [ ] Queue position display
- [ ] Estimated wait times
- [ ] Agent availability count
- [ ] Historical availability patterns
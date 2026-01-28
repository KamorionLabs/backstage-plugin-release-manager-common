# @kamorionlabs/backstage-plugin-release-manager-common

Shared types and utilities for the Backstage Release Manager plugins.

## Installation

```bash
# yarn
yarn add @kamorionlabs/backstage-plugin-release-manager-common

# npm
npm install @kamorionlabs/backstage-plugin-release-manager-common
```

## Usage

```typescript
import {
  Environment,
  Release,
  Configuration,
  ConfigDiff,
  ReleaseMatrix,
  RELEASE_MANAGER_ANNOTATIONS,
} from '@kamorionlabs/backstage-plugin-release-manager-common';
```

## Types Overview

### Core Types

| Type | Description |
|------|-------------|
| `Environment` | Environment definition (staging, prod, etc.) |
| `Release` | A deployment event record |
| `DeploymentInfo` | Current live deployment state |
| `Configuration` | Configuration snapshot |
| `ConfigDiff` | Comparison between two environments |
| `DriftEvent` | Configuration/version drift detection |

### Provider Types

| Type | Description |
|------|-------------|
| `KubernetesProviderConfig` | K8s cluster configuration |
| `AwsProviderConfig` | AWS account configuration |
| `AzureProviderConfig` | Azure subscription configuration |

### Deployment Targets

| Type | Description |
|------|-------------|
| `KubernetesDeploymentTarget` | K8s deployment (namespace + selector) |
| `AwsLambdaDeploymentTarget` | Lambda function |
| `AwsEcsDeploymentTarget` | ECS service |

### Matrix Types

| Type | Description |
|------|-------------|
| `ReleaseMatrix` | Full system release overview |
| `ReleaseMatrixRow` | Single component across environments |
| `ReleaseMatrixCell` | Single component in one environment |

## Annotation Keys

```typescript
import { RELEASE_MANAGER_ANNOTATIONS } from '@kamorionlabs/backstage-plugin-release-manager-common';

// Available keys:
RELEASE_MANAGER_ANNOTATIONS.ENVIRONMENT       // 'release-manager.io/environment'
RELEASE_MANAGER_ANNOTATIONS.ENVIRONMENT_CONFIG // 'release-manager.io/config'
RELEASE_MANAGER_ANNOTATIONS.DEPLOYMENTS       // 'release-manager.io/deployments'
RELEASE_MANAGER_ANNOTATIONS.CONFIG_SCHEMA     // 'release-manager.io/config-schema'
```

## Related Packages

- [@kamorionlabs/backstage-plugin-release-manager](https://github.com/KamorionLabs/backstage-plugin-release-manager) - Frontend plugin
- [@kamorionlabs/backstage-plugin-release-manager-backend](https://github.com/KamorionLabs/backstage-plugin-release-manager-backend) - Backend plugin

## License

Apache-2.0

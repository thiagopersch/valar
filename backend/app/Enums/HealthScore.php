<?php

namespace App\Enums;

enum HealthScore: string
{
    case PROMOTER = 'promoter';
    case INACTIVE = 'inactive';
    case RECOVERED = 'recovered';
    case ATTENTION = 'attention';
    case CHURN_RISK = 'churn_risk';
    case CHURNED = 'churned';
    case NEUTRAL = 'neutral';
    case RECOVERING = 'recovering';
}

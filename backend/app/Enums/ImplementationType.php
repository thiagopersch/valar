<?php

namespace App\Enums;

enum ImplementationType: string
{
    case TECHNICAL = 'technical';
    case CONSULTATIVE = 'consultative';
    case CHECK = 'check';
    case BOTH = 'both';
    case STANDARD = 'standard';
    case ON_DEMAND = 'on_demand';
}

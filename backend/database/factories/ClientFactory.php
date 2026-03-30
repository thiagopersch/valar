<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Enums\HealthScore;
use App\Enums\ImplementationType;
use App\Enums\PriorityLevel;
use App\Enums\DemandLevel;
use App\Enums\Level;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Client>
 */
class ClientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array {
        return [
            'id' => $this->faker->uuid,
            'name' => $this->faker->company,
            'email' => $this->faker->unique()->companyEmail,
            'phone' => $this->faker->phoneNumber,
            'contact_name' => $this->faker->name,
            'url' => $this->faker->url,
            'status' => true,
            'contract_start_date' => $this->faker->date(),
            'contract_end_date' => $this->faker->date(),
            'foundation_date' => $this->faker->date(),
            'old_contractual_level' => $this->faker->randomElement(['1', '2', '3', '4', '5']),
            'contractual_level' => $this->faker->randomElement(Level::cases()),
            'potential_level' => $this->faker->randomElement(Level::cases()),
            'demand_level' => $this->faker->randomElement(DemandLevel::cases()),
            'priority_level' => $this->faker->randomElement(PriorityLevel::cases()),
            'implementation_type' => $this->faker->randomElement(ImplementationType::cases()),
            'health_score' => $this->faker->randomElement(HealthScore::cases()),
        ];
    }
}

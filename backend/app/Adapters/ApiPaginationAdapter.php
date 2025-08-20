<?php

namespace App\Adapters;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

class ApiPaginationAdapter
{

    public function __construct(
        protected string $url,
        protected string $counter,
        protected int $page,
        protected int $perPage,
        protected Collection $data
    ) {
    }

    public function toJson() {
        return JsonResource::collection($this->data)
            ->additional([
                'meta' => [
                    'total' => $this->total(),
                    'page' => $this->page(),
                    'perPage' => $this->perPage(),
                    'currentPage' => $this->currentPage(),
                    'nextPage' => $this->nextPage(),
                    'previousPage' => $this->previousPage(),
                    'isFirstPage' => $this->isFirstPage(),
                    'isLastPage' => $this->isLastPage(),
                    'totalPages' => $this->totalPages(),
                ]
            ]);
    }

    public function url(): string {
        return $this->url;
    }
    public function total(): string {
        return $this->counter;
    }
    public function perPage(): int {
        return $this->perPage;
    }
    public function page(): int {
        return $this->page;
    }
    public function totalPages(): int {
        return ceil($this->total() / $this->perPage());
    }
    public function currentPage(): string {
        return $this->url . '?page=' . $this->page . '&perPage=' . $this->perPage();
    }

    public function nextPage(): string {
        $nextPage = $this->page() + 1;
        if ($nextPage > $this->totalPages()) {
            $nextPage = $this->page;
        }
        return $this->url . '?page=' . $nextPage . '&perPage=' . $this->perPage();
    }

    public function previousPage(): string {
        $previousPage = $this->page() - 1;
        if ($previousPage < 1) {
            $previousPage = 1;
        }
        return $this->url . '?page=' . $previousPage . '&perPage=' . $this->perPage();
    }

    public function isFirstPage(): bool {
        return $this->page() == 1;
    }

    public function isLastPage(): bool {
        return $this->page() == $this->totalPages();
    }

    public function data() {
        return $this->data->toArray();
    }
}

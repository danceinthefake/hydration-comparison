<script lang="ts">
  let isYearly = false;

  const plans = [
    {
      name: 'Starter',
      monthlyPrice: 9,
      yearlyPrice: 90,
      features: ['5 Projects', '10GB Storage', 'Basic Support', 'API Access'],
      popular: false
    },
    {
      name: 'Pro',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: ['Unlimited Projects', '100GB Storage', 'Priority Support', 'API Access', 'Analytics', 'Team Collaboration'],
      popular: true
    },
    {
      name: 'Enterprise',
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: ['Unlimited Everything', '1TB Storage', '24/7 Support', 'Custom Integrations', 'Advanced Analytics', 'SSO', 'Dedicated Account Manager'],
      popular: false
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  };

  $: savings = isYearly ? 'Save 17%' : '';
</script>

<section id="pricing" class="pricing-section">
  <h2>Simple, Transparent Pricing</h2>
  <p class="pricing-subtitle">Choose the plan that's right for you</p>

  <div class="toggle-container">
    <span class:active={!isYearly}>Monthly</span>
    <button
      class="toggle-switch"
      on:click={() => isYearly = !isYearly}
      aria-pressed={isYearly}
      role="switch"
    >
      <span class="toggle-slider" class:yearly={isYearly}></span>
    </button>
    <span class:active={isYearly}>
      Yearly
      {#if savings}
        <span class="savings-badge">{savings}</span>
      {/if}
    </span>
  </div>

  <div class="pricing-grid">
    {#each plans as plan}
      <div class="pricing-card" class:popular={plan.popular}>
        {#if plan.popular}
          <div class="popular-badge">Most Popular</div>
        {/if}
        <h3>{plan.name}</h3>
        <div class="price">
          <span class="currency">$</span>
          <span class="amount">{getPrice(plan)}</span>
          <span class="period">/{isYearly ? 'year' : 'month'}</span>
        </div>
        <ul class="features">
          {#each plan.features as feature}
            <li>
              <span class="check">✓</span> {feature}
            </li>
          {/each}
        </ul>
        <button class="plan-btn" class:primary={plan.popular}>
          Get Started
        </button>
      </div>
    {/each}
  </div>
</section>

<style>
  .pricing-section {
    padding: 4rem 2rem;
    background: linear-gradient(180deg, #f8f9fa 0%, #fff 100%);
  }

  .pricing-section h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: #1a1a2e;
  }

  .pricing-subtitle {
    text-align: center;
    color: #666;
    margin-bottom: 2rem;
  }

  .toggle-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 3rem;
  }

  .toggle-container span {
    color: #666;
    transition: color 0.3s;
  }

  .toggle-container span.active {
    color: #1a1a2e;
    font-weight: 600;
  }

  .savings-badge {
    background: #10b981;
    color: white;
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
    border-radius: 20px;
    margin-left: 0.5rem;
  }

  .toggle-switch {
    width: 60px;
    height: 32px;
    background: #e0e0e0;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    position: relative;
    transition: background 0.3s;
  }

  .toggle-switch:hover {
    background: #d0d0d0;
  }

  .toggle-slider {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 24px;
    height: 24px;
    background: white;
    border-radius: 50%;
    transition: transform 0.3s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .toggle-slider.yearly {
    transform: translateX(28px);
  }

  .pricing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    max-width: 1100px;
    margin: 0 auto;
  }

  .pricing-card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    position: relative;
    transition: transform 0.3s;
  }

  .pricing-card:hover {
    transform: translateY(-5px);
  }

  .pricing-card.popular {
    border: 2px solid #667eea;
    transform: scale(1.05);
  }

  .pricing-card.popular:hover {
    transform: scale(1.05) translateY(-5px);
  }

  .popular-badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.3rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .pricing-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #1a1a2e;
  }

  .price {
    margin-bottom: 1.5rem;
  }

  .currency {
    font-size: 1.5rem;
    vertical-align: top;
    color: #667eea;
  }

  .amount {
    font-size: 3rem;
    font-weight: 700;
    color: #1a1a2e;
  }

  .period {
    color: #666;
    font-size: 1rem;
  }

  .features {
    list-style: none;
    padding: 0;
    margin-bottom: 2rem;
  }

  .features li {
    padding: 0.5rem 0;
    color: #555;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .check {
    color: #10b981;
    font-weight: bold;
  }

  .plan-btn {
    width: 100%;
    padding: 1rem;
    border: 2px solid #667eea;
    background: white;
    color: #667eea;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }

  .plan-btn:hover {
    background: #667eea;
    color: white;
  }

  .plan-btn.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: transparent;
    color: white;
  }

  .plan-btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }

  @media (max-width: 900px) {
    .pricing-card.popular {
      transform: none;
    }

    .pricing-card.popular:hover {
      transform: translateY(-5px);
    }
  }
</style>

import { useRef, useState } from 'react';
import './App.css';

const sourceUrl = 'https://github.com/mojtabafazeli/relay';

const workflow = [
  { number: '01', title: 'Define', detail: 'Describe the work in relay.yaml.' },
  { number: '02', title: 'Run', detail: 'Let agents and scripts take their turns.' },
  { number: '03', title: 'Review', detail: 'Collect feedback and human approvals.' },
  { number: '04', title: 'Inspect', detail: 'Read the run state and audit log.' },
];

const features = [
  {
    icon: '01',
    title: 'Workflows in plain YAML',
    description:
      'Compose ordered task, review, and gate stages in files your team can read, version, and adapt.',
  },
  {
    icon: '02',
    title: 'Bring your own tools',
    description:
      'Connect Claude Code, a generic command-line agent, scripts, and people. Relay uses your existing CLI logins.',
  },
  {
    icon: '03',
    title: 'Review with a real loop',
    description:
      'Reviewers take turns, comments go to the run log, and any approval applies only to the exact artifact revision.',
  },
  {
    icon: '04',
    title: 'See what will happen',
    description:
      'Review a pre-run summary of tools, commands, workdir, permissions, sandbox status, and dirty files before execution.',
  },
  {
    icon: '05',
    title: 'Bounded and stoppable',
    description:
      'Set run and turn time limits, stop a run, and let Relay terminate the child process tree across macOS, Windows, and Linux.',
  },
  {
    icon: '06',
    title: 'Keep a local record',
    description:
      'Inspect run state, decisions, snapshots, and an append-only event log in your project’s .relay/ directory.',
  },
];

const commands = [
  ['relay init', 'Create a starter workflow'],
  ['relay validate', 'Check config and agent availability'],
  ['relay agents test', 'Ping configured AI agents'],
  ['relay run', 'Start the workflow'],
  ['relay status', 'Inspect the latest run'],
  ['relay stop <id>', 'Ask a run to stop'],
];

function Mark({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand-mark${small ? ' brand-mark-small' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 36 36" fill="none">
        <path
          d="M5 18h10.5c4.2 0 5.3-9 10.1-9H31M5 18h10.5c4.2 0 5.3 9 10.1 9H31"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="6" cy="18" r="3" fill="currentColor" />
        <circle cx="30" cy="9" r="3" fill="currentColor" />
        <circle cx="30" cy="27" r="3" fill="currentColor" />
      </svg>
    </span>
  );
}

function App() {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuButton = useRef<HTMLButtonElement>(null);

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText('npm ci && npm run build');
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
    window.setTimeout(() => setCopyStatus('idle'), 1800);
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header
        className="site-header"
        onKeyDown={(event) => {
          if (event.key === 'Escape' && mobileMenuOpen) {
            closeMobileMenu();
            mobileMenuButton.current?.focus();
          }
        }}
      >
        <a className="brand" href="#home" aria-label="Relay home">
          <Mark />
          <span>relay<span className="brand-period">.</span></span>
        </a>
        <nav
          id="main-navigation"
          className={`main-nav${mobileMenuOpen ? ' main-nav-open' : ''}`}
          aria-label="Main navigation"
        >
          <a href="#how-it-works" onClick={closeMobileMenu}>How it works</a>
          <a href="#features" onClick={closeMobileMenu}>Features</a>
          <a href="#quickstart" onClick={closeMobileMenu}>Quickstart</a>
          <a href="#commands" onClick={closeMobileMenu}>CLI reference</a>
        </nav>
        <button
          ref={mobileMenuButton}
          className="mobile-menu-toggle"
          type="button"
          aria-controls="main-navigation"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span aria-hidden="true">{mobileMenuOpen ? '×' : '☰'}</span>
        </button>
        <a className="header-link" href={sourceUrl}>
          Source access <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main id="main-content">
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="status-dot" aria-hidden="true" /> File-defined workflow orchestration</div>
            <h1>From a prompt<br />to a <span>working process.</span></h1>
            <p className="hero-lede">
              Relay connects AI agents, scripts, and people in repeatable workflows you can
              inspect, review, and run from your terminal.
            </p>
            <div className="hero-actions">
              <a className="button button-lime" href="#quickstart">
                Get started <span aria-hidden="true">↗</span>
              </a>
              <a className="button button-quiet" href="#how-it-works">
                Explore the workflow <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="hero-meta">
              <span><i className="meta-node" aria-hidden="true" /> Node.js 22+</span>
              <span><i className="meta-node" aria-hidden="true" /> macOS · Windows · Linux</span>
              <span><i className="meta-node" aria-hidden="true" /> TypeScript</span>
            </div>
          </div>

          <div className="terminal-card" role="group" aria-label="Example Relay workflow configuration">
            <div className="terminal-top">
              <div className="window-dots" aria-hidden="true"><i /><i /><i /></div>
              <span>relay.yaml</span>
              <span className="terminal-badge">workflow</span>
            </div>
            <div className="terminal-code">
              <div><span className="line-no">01</span><span className="code-dim">version:</span> <span className="code-green">1</span></div>
              <div><span className="line-no">02</span><span className="code-dim">agents:</span></div>
              <div><span className="line-no">03</span>  <span className="code-blue">writer:</span></div>
              <div><span className="line-no">04</span>    <span className="code-dim">adapter:</span> <span className="code-peach">claude-cli</span></div>
              <div><span className="line-no">05</span>    <span className="code-dim">permissions:</span> <span className="code-green">[read, write-artifacts]</span></div>
              <div><span className="line-no">06</span>  <span className="code-blue">reviewer:</span></div>
              <div><span className="line-no">07</span>    <span className="code-dim">adapter:</span> <span className="code-peach">claude-cli</span></div>
              <div><span className="line-no">08</span>    <span className="code-dim">permissions:</span> <span className="code-green">[read]</span></div>
              <div className="code-gap"><span className="line-no">09</span></div>
              <div><span className="line-no">10</span><span className="code-dim">stages:</span></div>
              <div><span className="line-no">11</span>  - <span className="code-dim">id:</span> <span className="code-peach">draft</span></div>
              <div><span className="line-no">12</span>    <span className="code-dim">type:</span> <span className="code-peach">task</span></div>
              <div><span className="line-no">13</span>    <span className="code-dim">agent:</span> <span className="code-peach">writer</span></div>
              <div><span className="line-no">14</span>    <span className="code-dim">output:</span> <span className="code-green">draft.md</span></div>
              <div><span className="line-no">15</span>  - <span className="code-dim">id:</span> <span className="code-peach">review</span></div>
              <div><span className="line-no">16</span>    <span className="code-dim">type:</span> <span className="code-peach">review</span></div>
              <div><span className="line-no">17</span>    <span className="code-dim">artifact:</span> <span className="code-green">draft.md</span></div>
              <div><span className="line-no">18</span>    <span className="code-dim">author:</span> <span className="code-peach">writer</span></div>
              <div><span className="line-no">19</span>    <span className="code-dim">reviewers:</span> <span className="code-green">[reviewer]</span></div>
              <div><span className="line-no">20</span>    <span className="code-dim">max_rounds:</span> <span className="code-green">3</span></div>
              <div><span className="line-no">21</span>    <span className="code-dim">on_limit:</span> <span className="code-peach">ask-human</span><span className="code-cursor" aria-hidden="true">▍</span></div>
            </div>
            <div className="terminal-foot">
              <span><i className="terminal-live" /> human-approved steps</span>
              <span>workflow · 01</span>
            </div>
          </div>
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
        </section>

        <section className="trust-strip" aria-label="Relay properties">
          <div><span className="strip-icon" aria-hidden="true">⌘</span><span>File-defined workflows</span></div>
          <div><span className="strip-icon" aria-hidden="true">◎</span><span>Your tools, your logins</span></div>
          <div><span className="strip-icon" aria-hidden="true">◷</span><span>Local run records</span></div>
          <div><span className="strip-icon" aria-hidden="true">⌁</span><span>Cross-platform by design</span></div>
        </section>

        <section className="section-wrap workflow-section" id="how-it-works">
          <div className="section-heading">
            <div>
              <div className="eyebrow eyebrow-dark">The Relay loop</div>
              <h2>Make the process<br />part of the project.</h2>
            </div>
            <p>
              A workflow is a versioned YAML file, not a one-off chat. Relay coordinates each
              participant in order and records what happened along the way.
            </p>
          </div>
          <div className="workflow-steps">
            {workflow.map((step, index) => (
              <article className="workflow-step" key={step.number}>
                <div className="step-top">
                  <span className="step-number">{step.number}</span>
                  {index < workflow.length - 1 && <span className="step-connector" aria-hidden="true">⟶</span>}
                </div>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </article>
            ))}
          </div>
          <div className="workflow-note">
            <span className="note-icon" aria-hidden="true">↳</span>
            <p><strong>Human gates stay human.</strong> The <code>--yes</code> flag confirms the run summary; it never approves a review or gate for you.</p>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="section-wrap">
            <div className="section-heading features-heading">
              <div>
                <div className="eyebrow eyebrow-dark">Built to be understood</div>
                <h2>Coordination without<br />the black box.</h2>
              </div>
              <p>Relay stays deliberately inspectable: configuration, permissions, decisions, and run records live alongside your project.</p>
            </div>
            <div className="feature-grid">
              {features.map((feature) => (
                <article className="feature-card" key={feature.icon}>
                  <span className="feature-number">{feature.icon}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="quickstart-section section-wrap" id="quickstart">
          <div className="section-heading">
            <div>
              <div className="eyebrow eyebrow-dark">A few minutes to first run</div>
              <h2>Start with a<br />working example.</h2>
            </div>
            <div className="access-note">
              <span className="access-lock" aria-hidden="true">⌑</span>
              <p><strong>Source access is currently restricted.</strong><br />Relay’s source repository is private. You’ll need GitHub access to clone or download it.</p>
              <a href={sourceUrl}>Check repository access <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="quickstart-grid">
            <div className="quickstart-copy">
              <div className="prereq-list">
                <div><span className="prereq-check" aria-hidden="true">✓</span><span><strong>Node.js 22 or newer</strong><small>Check with <code>node --version</code></small></span></div>
                <div><span className="prereq-check" aria-hidden="true">✓</span><span><strong>Git</strong><small>Required for workflows that write files</small></span></div>
                <div><span className="prereq-check prereq-optional" aria-hidden="true">↗</span><span><strong>An AI CLI (optional)</strong><small>Claude Code for AI stages; the example needs only Node</small></span></div>
              </div>
              <p className="quickstart-tip"><strong>Just exploring?</strong> The bundled <code>example</code> workflow runs a Node script without an AI account. Claude Code and generic CLI agents can run AI stages; Codex support is not verified yet.</p>
            </div>
            <div className="install-card">
              <div className="install-card-head"><span>Build from source</span><span className="platform-tag">macOS · Windows · Linux</span></div>
              <ol className="install-steps">
                <li><span className="install-number" aria-hidden="true">1</span><div><span>Clone and enter the project</span><pre tabIndex={0}><code>git clone {sourceUrl}.git<br />cd relay</code></pre></div></li>
                <li><span className="install-number" aria-hidden="true">2</span><div><span>Install dependencies and build</span><pre tabIndex={0}><code>npm ci<br />npm run build</code></pre></div></li>
                <li><span className="install-number" aria-hidden="true">3</span><div><span>Create a starter project and check it</span><pre tabIndex={0}><code>node dist/src/cli/index.js init --template example<br />node dist/src/cli/index.js validate</code></pre></div></li>
                <li><span className="install-number" aria-hidden="true">4</span><div><span>Run the workflow</span><pre tabIndex={0}><code>node dist/src/cli/index.js run --yes</code></pre></div></li>
              </ol>
              <div className="install-card-foot">
                <span>Want the <code>relay</code> command? Run <code>npm link</code> from the cloned project.</span>
                <button className="copy-button" onClick={copyCommand} type="button" aria-label="Copy build commands">
                  {copyStatus === 'copied' ? 'Copied ✓' : copyStatus === 'failed' ? 'Copy failed' : 'Copy build commands'}
                </button>
                <span className="visually-hidden" aria-live="polite">
                  {copyStatus === 'copied' ? 'Build commands copied.' : copyStatus === 'failed' ? 'Could not copy build commands.' : ''}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="commands-section" id="commands">
          <div className="section-wrap commands-layout">
            <div>
              <div className="eyebrow">At the command line</div>
              <h2>Small CLI.<br />Clear controls.</h2>
              <p>Start, inspect, and stop workflows without leaving your terminal.</p>
            </div>
            <div className="command-list">
              {commands.map(([command, description]) => (
                <div className="command-row" key={command}>
                  <code>{command}</code><span>{description}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="safety-section section-wrap">
          <div className="safety-mark"><Mark small /></div>
          <div className="safety-copy">
            <div className="eyebrow eyebrow-dark">Know before you run</div>
            <h2>Safety is visible.<br />Not implied.</h2>
            <p>
              Relay shows each agent’s resolved executable, permissions, and sandbox state before
              work begins. It checks AI-written changes through Git and requires confirmation for
              elevated or unsandboxed access.
            </p>
          </div>
          <div className="safety-list">
            <div><span aria-hidden="true">↗</span><p><strong>Review the access summary</strong><small>Commands, workdir, Git status, and agent access before the run.</small></p></div>
            <div><span aria-hidden="true">◷</span><p><strong>Set practical limits</strong><small>Bound individual turns and total run time.</small></p></div>
            <div><span aria-hidden="true">◎</span><p><strong>Keep credentials with you</strong><small>Relay uses existing CLI logins; it does not host model APIs.</small></p></div>
            <div><span aria-hidden="true">!</span><p><strong>Understand the boundaries</strong><small>Git checks cannot see writes outside the workdir or prevent a permitted process from transmitting data.</small></p></div>
          </div>
        </section>

        <section className="final-cta">
          <div className="cta-pattern" aria-hidden="true" />
          <div className="final-cta-inner">
            <Mark />
            <div className="eyebrow">Your workflow, clearly defined</div>
            <h2>Make good work<br /><span>repeatable.</span></h2>
            <p>Explore the project or get in touch with the team for source access.</p>
            <a className="button button-lime" href={sourceUrl}>
              View Relay on GitHub <span aria-hidden="true">↗</span>
            </a>
            <span className="private-caption">Repository access is currently required to download the source.</span>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#home"><Mark small /><span>relay<span className="brand-period">.</span></span></a>
        <span>File-defined workflows for AI agents, scripts, and people.</span>
        <a href={sourceUrl}>GitHub <span aria-hidden="true">↗</span></a>
      </footer>
    </>
  );
}

export default App;

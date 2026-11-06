import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateDomain,
  evaluateThreat,
  calculateSecurityScore,
  generateDnsInstructions,
  analyzeSiteVulnerabilities,
  getEdgeNodesStatus,
  generateSecurityHeadersSnippet,
  generateMarkdownAuditReport,
  DEFAULT_SECURITY_RULES,
} from './securityEngine';

test('validateDomain normalizes valid domains correctly', () => {
  const res1 = validateDomain('https://tuosito.com/login?ref=1');
  assert.equal(res1.isValid, true);
  assert.equal(res1.domain, 'tuosito.com');

  const res2 = validateDomain('azienda.it');
  assert.equal(res2.isValid, true);
  assert.equal(res2.domain, 'azienda.it');
});

test('validateDomain rejects invalid domain strings', () => {
  const res1 = validateDomain('');
  assert.equal(res1.isValid, false);

  const res2 = validateDomain('just-a-string-no-tld');
  assert.equal(res2.isValid, false);
});

test('evaluateThreat detects and blocks SQL Injection when filter is enabled', () => {
  const sqliPayload = "admin' OR '1'='1' --";
  const result = evaluateThreat(sqliPayload, 'sqli', DEFAULT_SECURITY_RULES);
  
  assert.equal(result.isBlocked, true);
  assert.equal(result.action, 'BLOCKED_403');
  assert.equal(result.threatLevel, 'CRITICAL');
  assert.match(result.ruleTriggered, /CRS-942100/);
});

test('evaluateThreat flags bypass if SQL Injection filter is disabled', () => {
  const sqliPayload = "UNION SELECT null, username, password FROM users";
  const rulesWithoutSqli = { ...DEFAULT_SECURITY_RULES, sqlInjectionFilter: false };
  const result = evaluateThreat(sqliPayload, 'sqli', rulesWithoutSqli);
  
  assert.equal(result.isBlocked, false);
  assert.equal(result.action, 'ALLOWED_200');
  assert.match(result.ruleTriggered, /BYPASSED/);
});

test('evaluateThreat blocks Cross-Site Scripting (XSS) payload', () => {
  const xssPayload = "<script>alert('xss_attack')</script>";
  const result = evaluateThreat(xssPayload, 'xss', DEFAULT_SECURITY_RULES);

  assert.equal(result.isBlocked, true);
  assert.equal(result.action, 'BLOCKED_403');
  assert.equal(result.threatLevel, 'HIGH');
  assert.match(result.ruleTriggered, /CRS-941100/);
});

test('evaluateThreat triggers rate limit action on DDoS floods', () => {
  const result = evaluateThreat(
    'GET /api/search HTTP/1.1',
    'ddos',
    DEFAULT_SECURITY_RULES,
    'IT',
    500 // 500 req/min with threshold of 120
  );

  assert.equal(result.isBlocked, true);
  assert.equal(result.action, 'RATE_LIMITED_429');
  assert.equal(result.threatLevel, 'CRITICAL');
});

test('evaluateThreat enforces geo-blocking policy', () => {
  const result = evaluateThreat(
    'Normal legit payload',
    'sqli',
    DEFAULT_SECURITY_RULES,
    'RU' // In DEFAULT_SECURITY_RULES geoBlockList
  );

  assert.equal(result.isBlocked, true);
  assert.equal(result.action, 'BLOCKED_403');
  assert.match(result.ruleTriggered, /GEO-BLOCK-POLICY/);
});

test('evaluateThreat passes benign legitimate traffic', () => {
  const legitPayload = "searchTerm=cybersecurity+protection+suite";
  const result = evaluateThreat(legitPayload, 'sqli', DEFAULT_SECURITY_RULES, 'IT', 15);

  assert.equal(result.isBlocked, false);
  assert.equal(result.action, 'ALLOWED_200');
  assert.equal(result.threatLevel, 'CLEAN');
});

test('calculateSecurityScore reflects rule coverage accurately', () => {
  const maxScore = calculateSecurityScore(DEFAULT_SECURITY_RULES, 0);
  assert.equal(maxScore, 100);

  const reducedRules = {
    ...DEFAULT_SECURITY_RULES,
    sqlInjectionFilter: false,
    xssFilter: false,
    virtualPatching: false,
  };
  const lowerScore = calculateSecurityScore(reducedRules, 2);
  assert.ok(lowerScore < 60);
});

test('generateDnsInstructions outputs valid CNAME and IPs', () => {
  const dns = generateDnsInstructions('myshop.it', 'Business Armor');
  assert.equal(dns.domain, 'myshop.it');
  assert.equal(dns.proxyCname, 'myshop.it.edge.aegisshield.network');
  assert.ok(dns.proxyIps.length >= 2);
  assert.equal(dns.sslStatus, 'ACTIVE_AUTO');
});

test('analyzeSiteVulnerabilities returns structured findings and score', () => {
  const scan = analyzeSiteVulnerabilities('testsite.org');
  assert.equal(scan.domain, 'testsite.org');
  assert.ok(scan.findings.length >= 4);
  assert.ok(scan.score > 0 && scan.score <= 100);
});

test('getEdgeNodesStatus returns operational PoP nodes with low latencies', () => {
  const nodes = getEdgeNodesStatus();
  assert.ok(nodes.length >= 5);
  const milanNode = nodes.find((n) => n.city === 'Milano');
  assert.ok(milanNode);
  assert.ok(milanNode.latencyMs < 1.0);
});

test('generateSecurityHeadersSnippet produces strict HSTS and CSP directives', () => {
  const nginxSnippet = generateSecurityHeadersSnippet('nginx', 'example.com');
  assert.match(nginxSnippet, /Strict-Transport-Security/);
  assert.match(nginxSnippet, /Content-Security-Policy/);
  assert.match(nginxSnippet, /X-Frame-Options "DENY"/);

  const caddySnippet = generateSecurityHeadersSnippet('caddy', 'example.com');
  assert.match(caddySnippet, /reverse_proxy/);
});

test('generateMarkdownAuditReport generates valid markdown document with findings', () => {
  const scan = analyzeSiteVulnerabilities('azienda.it');
  const report = generateMarkdownAuditReport('azienda.it', scan);
  assert.match(report, /# Report Audit di Sicurezza Perimetrale Web/);
  assert.match(report, /azienda\.it/);
  assert.match(report, /CNAME/);
});


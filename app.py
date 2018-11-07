from flask import Flask, jsonify, url_for, render_template
import json
import requests

app = Flask(__name__)


@app.route('/')
def index():
    account = '734126'
    usage = current_usage(account)
    current = usage.pop()
    updated = current.get('asOfDate')
    quota = current.get('quotaTxt')
    used = current.get('percentageUsed')
    download = current.get('downloadSpeed')
    upload = current.get('uploadSpeed')
    return render_template('dashboard.html', updated=updated, quota=quota, used=used, download=download, upload=upload, account=account)

@app.route('/kyle')
def kyle():
    account = '787006'
    usage = current_usage(account)
    current = usage.pop()
    updated = current.get('asOfDate')
    quota = current.get('quotaTxt')
    used = current.get('percentageUsed')
    download = current.get('downloadSpeed')
    upload = current.get('uploadSpeed')
    return render_template('dashboard.html', updated=updated, quota=quota, used=used, download=download, upload=upload, account=account)

def current_usage(account):
    r = requests.get('https://usage.tech/usages?accountNumber={0}'.format(account))
    if r.status_code == 200:
        lines = r.text.split('\n')
        for line in lines:
            if 'var data' in line:
                line = line[22:-2]
                data = json.loads(line)
                return data.get('Payload')

    return {}

@app.route('/usage/<account>')
def usage_response(account):
    return jsonify(current_usage(account))

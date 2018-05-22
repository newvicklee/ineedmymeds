from flask import Flask


app = Flask(__name__)
app.config.from_object('config')
from backend import api


if not app.debug:
    import logging
    from logging.handlers import RotatingFileHandler
    file_handler = RotatingFileHandler('logging/flasklogger.log', 'a', 1 * 1024 * 1024,  10)
    file_handler.setFormatter(logging.Formatter('%(asctime)s%(levelname)s:  %(message)s [in %(pathname)s:%(lineno)d]'))
#    app.logger.setLevel(logging.INFO)
#    file_handler.setLevel(logging.INFO)
    file_handler.setLevel(logging.ERROR)
    app.logger.addHandler(file_handler)


'use strict';

module.exports.getStyleXsl = (event, context, callback) => {
	const xmlOutput = `<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:cap="urn:oasis:names:tc:emergency:cap:1.2" xmlns:ha="http://www.alerting.net/namespace/index_1.0" version="1.0">
<xsl:output method="html" doctype-system="http://www.w3.org/TR/html4/strict.dtd" doctype-public="-//W3C//DTD HTML 4.01//EN" indent="yes"/>
<!--   Feed header   -->
<xsl:template match="cap:alert">
<html>
<head>
<title>
<xsl:value-of select="cap:note/text()"/>
</title>
</head>
<body>
<table class="alert">
<tr>
<td class="label">Message:</td>
<td>
<xsl:value-of select="cap:identifier/text()"/>
<span class="tiny">from</span>
<xsl:value-of select="cap:sender/text()"/>
</td>
</tr>
<tr>
<td class="label">Sent:</td>
<td>
<xsl:value-of select="substring(normalize-space(cap:sent/text()), 12, 5)"/>
<span class="tiny">on</span>
<xsl:value-of select="substring(normalize-space(cap:sent/text()), 6, 2)"/>
-
<xsl:value-of select="substring(normalize-space(cap:sent/text()), 9, 2)"/>
-
<xsl:value-of select="substring(normalize-space(cap:sent/text()), 1, 4)"/>
</td>
</tr>
<tr>
<td class="label">Effective:</td>
<td>
<xsl:value-of select="substring(normalize-space(cap:info/cap:effective/text()), 12, 5)"/>
<span class="tiny">on</span>
<xsl:value-of select="substring(normalize-space(cap:info/cap:effective/text()), 6, 2)"/>
-
<xsl:value-of select="substring(normalize-space(cap:info/cap:effective/text()), 9, 2)"/>
-
<xsl:value-of select="substring(normalize-space(cap:info/cap:effective/text()), 1, 4)"/>
</td>
</tr>
<tr>
<td class="label">Expires:</td>
<td>
<xsl:value-of select="substring(normalize-space(cap:info/cap:expires/text()), 12, 5)"/>
<span class="tiny">on</span>
<xsl:value-of select="substring(normalize-space(cap:info/cap:expires/text()), 6, 2)"/>
-
<xsl:value-of select="substring(normalize-space(cap:info/cap:expires/text()), 9, 2)"/>
-
<xsl:value-of select="substring(normalize-space(cap:info/cap:expires/text()), 1, 4)"/>
</td>
</tr>
<tr>
<td colspan="2">
<table class="entry">
<tr>
<td class="label">Event:</td>
<td class="headline">
<xsl:value-of select="cap:info/cap:event/text()"/>
</td>
</tr>
<tr>
<td class="label">Alert:</td>
<td class="description">
<xsl:variable name="descrip">
<xsl:call-template name="globalReplace">
<xsl:with-param name="outputString" select="substring(cap:info/cap:description/text(),1)"/>
<xsl:with-param name="target" select="' *'"/>
<xsl:with-param name="replacement" select="' *'"/>
</xsl:call-template>
</xsl:variable>
<xsl:variable name="descrip2">
<xsl:call-template name="globalReplace">
<xsl:with-param name="outputString" select="$descrip"/>
<xsl:with-param name="target" select="' .'"/>
<xsl:with-param name="replacement" select="' .'"/>
</xsl:call-template>
</xsl:variable>
<xsl:variable name="descrip3">
<xsl:call-template name="globalReplace">
<xsl:with-param name="outputString" select="$descrip2"/>
<xsl:with-param name="target" select="'... THE'"/>
<xsl:with-param name="replacement" select="'... THE'"/>
</xsl:call-template>
</xsl:variable>
<xsl:variable name="descrip4">
<xsl:call-template name="globalReplace">
<xsl:with-param name="outputString" select="$descrip3"/>
<xsl:with-param name="target" select="'... A'"/>
<xsl:with-param name="replacement" select="'... A'"/>
</xsl:call-template>
</xsl:variable>
<!--

 force a space before newline to facilitate url links 
-->
<xsl:variable name="descrip5">
<xsl:call-template name="globalReplace">
<xsl:with-param name="outputString" select="$descrip4"/>
<xsl:with-param name="target" select="' '"/>
<xsl:with-param name="replacement" select="' '"/>
</xsl:call-template>
</xsl:variable>
<!--   make links hot   -->
<xsl:variable name="descrip6">
<xsl:call-template name="hotlink">
<xsl:with-param name="text" select="$descrip5"/>
<xsl:with-param name="searchterm1" select="'HTTP'"/>
</xsl:call-template>
</xsl:variable>
<pre class="description">
<xsl:copy-of select="$descrip6"/>
</pre>
</td>
</tr>
<tr>
<td class="label">Instructions:</td>
<td class="description">
<xsl:value-of select="cap:info/cap:instruction/text()"/>
</td>
</tr>
<tr>
<td class="label">Target Area:</td>
<td>
<table class="detail">
<tr>
<td colspan="2">
<xsl:variable name="areas1">
<xsl:call-template name="globalReplace">
<xsl:with-param name="outputString" select="cap:info/cap:area/cap:areaDesc/text()"/>
<xsl:with-param name="target" select="'/'"/>
<xsl:with-param name="replacement" select="' '"/>
</xsl:call-template>
</xsl:variable>
<xsl:variable name="areas">
<xsl:call-template name="globalReplace">
<xsl:with-param name="outputString" select="$areas1"/>
<xsl:with-param name="target" select="';'"/>
<xsl:with-param name="replacement" select="' '"/>
</xsl:call-template>
</xsl:variable>
<xsl:variable name="firstchar" select="substring($areas,1,1)"/>
<xsl:choose>
<xsl:when test="$firstchar = ' '">
<!--   first character is a carriage return   -->
<xsl:call-template name="br-replace">
<xsl:with-param name="text" select="substring($areas,2)"/>
</xsl:call-template>
</xsl:when>
<xsl:otherwise>
<xsl:call-template name="br-replace">
<xsl:with-param name="text" select="$areas"/>
</xsl:call-template>
</xsl:otherwise>
</xsl:choose>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td class="label">Forecast Office:</td>
<td>
<xsl:value-of select="cap:info/cap:senderName/text()"/>
</td>
</tr>
</table>
</body>
</html>
</xsl:template>
<!--   Replace function   -->
<xsl:template name="globalReplace">
<xsl:param name="outputString"/>
<xsl:param name="target"/>
<xsl:param name="replacement"/>
<xsl:choose>
<xsl:when test="contains($outputString,$target)">
<xsl:value-of select="concat(substring-before($outputString,$target),$replacement)"/>
<xsl:call-template name="globalReplace">
<xsl:with-param name="outputString" select="substring-after($outputString,$target)"/>
<xsl:with-param name="target" select="$target"/>
<xsl:with-param name="replacement" select="$replacement"/>
</xsl:call-template>
</xsl:when>
<xsl:otherwise>
<xsl:value-of select="$outputString"/>
</xsl:otherwise>
</xsl:choose>
</xsl:template>
<!--   Replace new lines with html <br> tags   -->
<xsl:template name="br-replace">
<xsl:param name="text"/>
<xsl:variable name="cr" select="' '"/>
<xsl:choose>
<!--

 If the value of the $text parameter contains carriage ret 
-->
<xsl:when test="contains($text,$cr)">
<!--

 Return the substring of $text before the carriage return 
-->
<xsl:value-of select="substring-before($text,$cr)"/>
<!--   And construct a <br/> element   -->
<br/>
<!--


         | Then invoke this same br-replace template again, passing the
         | substring *after* the carriage return as the new "$text" to
         | consider for replacement
         +
-->
<xsl:call-template name="br-replace">
<xsl:with-param name="text" select="substring-after($text,$cr)"/>
</xsl:call-template>
</xsl:when>
<xsl:otherwise>
<xsl:value-of select="$text"/>
</xsl:otherwise>
</xsl:choose>
</xsl:template>
<!--   If it looks like a link, make it hot   -->
<xsl:template name="hotlink">
<xsl:param name="text"/>
<xsl:param name="searchterm1"/>
<xsl:variable name="lcletters">abcdefghijklmnopqrstuvwxyz</xsl:variable>
<xsl:variable name="ucletters">ABCDEFGHIJKLMNOPQRSTUVWXYZ</xsl:variable>
<xsl:choose>
<xsl:when test="contains($text,$searchterm1)">
<!--   grab data before the searchterm   -->
<xsl:value-of select="substring-before($text,$searchterm1)"/>
<a border="0">
<xsl:attribute name="href">
<!--

 determine actual link by taking data from the searchterm to 
          either the space or the newline - whichever is first  
-->
<xsl:value-of select="translate(concat($searchterm1,substring-before(substring-after($text,$searchterm1),' ')),$ucletters,$lcletters)"/>
</xsl:attribute>
<xsl:value-of select="translate(concat($searchterm1,substring-before(substring-after($text,$searchterm1),' ')),$ucletters,$lcletters)"/>
</a>
<!--   data after the link - check for more links   -->
<xsl:call-template name="hotlink">
<xsl:with-param name="text" select="substring-after(substring-after($text,$searchterm1),' ')"/>
<xsl:with-param name="searchterm1" select="$searchterm1"/>
</xsl:call-template>
</xsl:when>
<xsl:otherwise>
<xsl:value-of select="$text"/>
</xsl:otherwise>
</xsl:choose>
</xsl:template>
<!--   Ignore anything else   -->
<xsl:template match="*"/>
</xsl:stylesheet>`

	const response = {
		statusCode: 200,
		headers: {
			'Content-Type': 'text/xsl'
		},
		body: xmlOutput
	}

	callback(null, response);
};

